import { SparqlObject } from "@/model/SparqlObject";

const testIRI = "http://example.com/value/one";
const testIRI2 = "http://example.net/world/location#Pacific%20Ocean";
const testElement = "one";
const testElement2 = "Pacific%20Ocean";
const testLabel = "Example Object";
const testLabel2 = "Other Object";

const exampleUrlList = [
  "http://example.com/sparql",
  "http://example.net/sparql",
  "http://example.org/sparql",
  "http://example.edu/sparql"
];
const webTestCases = [
  "http://test.com/other#",
  "http://test.com/other#red",
  "https://localhost/",
  "http://192.168.0.1/browser/en",
  "http://[::1]/url/long/path.html",
  "http://[::1]/url/long/path.htm"
];
const iriTestCases = [
  "pre:test",
  "file:///C:/Users/test.txt",
  "geo:12.34,23.45",
  "mailto:text@example.com",
  "tel:+49-341-12345678"
];
const commonPrefixes = new Map([
  ["rdfs","http://www.w3.org/2000/01/rdf-schema#"],
  ["foaf","http://xmlns.com/foaf/0.1/"],
  ["owl","http://www.w3.org/2002/07/owl#"],
]);

describe('SparqlObject.ts', () =>
{
  describe('constructor and value assignments', () => 
  {
    it('instantiates all attributes', () => 
    {
      const testClass = new SparqlObject(testIRI, testLabel);
      expect(testClass).toHaveProperty("_iri",testIRI);
      expect(testClass).toHaveProperty("_label",testLabel);
      expect(testClass).toHaveProperty("_label",testLabel);
    });

    it('uses working getters and setter assignments', () =>
    {
      const testClass = new SparqlObject(testIRI, testLabel);

      expect(testClass.iri).toEqual(testIRI);
      testClass.label=testLabel2;
      expect(testClass.label).toEqual(testLabel2);
      expect(testClass.hasProps).toBe(false);
      testClass.hasProps = true;
      expect(testClass.hasProps).toBe(true);
    });

    it('remembers state of subproperties of overwritten properties', () => 
    {
      const testClass = new SparqlObject(testIRI, testLabel);
      const testProp = new SparqlObject(exampleUrlList[0], "Label0");
      const testObj1 = new SparqlObject(exampleUrlList[1], "Label1");
      const testObj2 = new SparqlObject(exampleUrlList[1], "Label2");

      testClass.addAttributeOfProperty(testProp, testObj1);
      expect(testClass.getAttributesOfProperty(testProp.iri).entries().next().value[0].hasProps).toBe(false);
      testObj2.hasProps = true;
      testClass.addAttributeOfProperty(testProp, testObj2);
      expect(testClass.getAttributesOfProperty(testProp.iri).entries().next().value[0].hasProps).toBe(true);
      testClass.addAttributeOfProperty(testProp, testObj1);
      expect(testClass.getAttributesOfProperty(testProp.iri).entries().next().value[0].hasProps).toBe(true);
    });
  });

  describe('rdfs labels', () =>
  {
    const prefixType = expect.stringMatching(/^pre[0-9]+:/);

    it('automatically assigns labels starting with pre[0-]:', () => 
    {
      let testClass = new SparqlObject(testIRI);
      expect(testClass.label).toEqual("pre0:"+testElement);


      testClass = new SparqlObject(testIRI2);
      expect(testClass.label).toEqual("pre1:"+testElement2);


      testClass = new SparqlObject(testIRI);
      expect(testClass.label).toEqual("pre0:"+testElement);
    });

    it('reidentifies previously used labels', () =>
    {
      for (const [short,long] of commonPrefixes)
        expect(new SparqlObject(`${long}value`).label).toEqual(`${short}:value`);

      const rememberedPrefixes:string[] = new Array(exampleUrlList.length);
      for(let i=0; i<exampleUrlList.length; i++) {
        const testObject = new SparqlObject(exampleUrlList[i]+"element1");
        expect(testObject.label).toEqual(prefixType);
        rememberedPrefixes[i] = testObject.label.slice(0,-8);
      }

      for(let i=exampleUrlList.length-1; i>=0; i--) {
        expect(new SparqlObject(exampleUrlList[i]+"el2").label.slice(0,-3)).toEqual(rememberedPrefixes[i]);
      }
    });


    it('correctly identifies the end of a prefix', () =>
    {
      for (const iri of webTestCases) {
        const testObject = new SparqlObject(iri);
        if (iri.endsWith("/") || iri.endsWith("#") || iri.endsWith("/en") || iri.endsWith(".htm") || iri.endsWith(".html")){
          expect(testObject.label).toEqual(iri);
        } else {
          expect(testObject.label).toEqual(prefixType);
        }
      }
    });
    
    it('does not shorten other IRIs than web URLs', () =>
    {
      for (const iri of iriTestCases) {
        const testObject = new SparqlObject(iri);
        expect(testObject.label).toEqual(iri);
      }
    });
  });

  describe('attributes', () => 
  {
    it('has no attributes on initialization', () => 
    {
      const object = new SparqlObject(testIRI);
      expect(object.getAttributes()).toEqual(new Map());
      expect(object.getAttributesOfProperty(testIRI2)).toEqual(new Set());
    });

    it('stores literals and objects as properties', () => 
    {
      const object = new SparqlObject(testIRI);
      const attrObject = new SparqlObject(testIRI2);
      const pred0 = new SparqlObject(exampleUrlList[0]);
      const pred1 = new SparqlObject(exampleUrlList[1]);

      const resMap = new Map<SparqlObject,Set<SparqlObject|string>>([
        [pred0, new Set([testLabel])],
        [pred1, new Set([attrObject])]
      ]);
      
      object.addAttributeOfProperty(pred0, testLabel);
      object.addAttributeOfProperty(pred1, attrObject);

      expect(object.getAttributes()).toEqual(resMap);
      for (const [resPred, resObj] of resMap) {
        expect(object.getAttributesOfProperty(resPred.iri)).toEqual(resObj);
      }
    });

    it('stores every attribute once', () => 
    {
      const object = new SparqlObject(testIRI);
      const attrObject = new SparqlObject(testIRI2);
      const pred0 = new SparqlObject(exampleUrlList[0]);
      const pred1 = new SparqlObject(exampleUrlList[1]);

      object.addAttributeOfProperty(pred0, testLabel);
      object.addAttributeOfProperty(pred0, testLabel);
      object.addAttributeOfProperty(pred0, testLabel);
      object.addAttributeOfProperty(pred1, attrObject);
      object.addAttributeOfProperty(pred1, attrObject);
      object.addAttributeOfProperty(pred1, attrObject);

      const resMap = new Map<SparqlObject,Set<SparqlObject|string>>([
        [pred0, new Set([testLabel])],
        [pred1, new Set([attrObject])]
      ]);
      
      expect(object.getAttributes()).toEqual(resMap);
      for (const [resPred, resObj] of resMap) {
        expect(object.getAttributesOfProperty(resPred.iri)).toEqual(resObj);
      }
    });

    it('can save multiple objects of one property', () => 
    {
      const object = new SparqlObject(testIRI);
      const attrObject = new SparqlObject(testIRI2);
      const pred = new SparqlObject(exampleUrlList[0]);

      object.addAttributeOfProperty(pred, testLabel);
      object.addAttributeOfProperty(pred, attrObject);

      const resMap = new Map<SparqlObject,Set<SparqlObject|string>>([
        [pred, new Set([testLabel, attrObject])]
      ]);
      
      expect(object.getAttributes()).toEqual(resMap);
      expect(object.getAttributesOfProperty(exampleUrlList[0])).toEqual(new Set([testLabel, attrObject]));
    });
  });

  describe('compare method', () => 
  {
    it('compares multiple objects by their label', () => {
      expect(new SparqlObject(testIRI,"a").compare(new SparqlObject(testIRI2,"B"))).toBe(-1);
      expect(new SparqlObject(testIRI,"b").compare(new SparqlObject(testIRI2,"A"))).toBe(1);
    });
    it('compares same-label objects by their IRI', () => {
      expect(new SparqlObject("a:a","a").compare(new SparqlObject("B:a","a"))).toBe(-1)
      expect(new SparqlObject("b:a","a").compare(new SparqlObject("A:a","a"))).toBe(1);
      expect(new SparqlObject("a:a","a").compare(new SparqlObject("a:a","a"))).toBe(0);
    })
  });
});
