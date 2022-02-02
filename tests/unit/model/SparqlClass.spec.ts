import { SparqlClass } from "@/model/SparqlClass";

const testIRI = "http://example.com/value/one";
const testIRI2 = "http://example.net/world/location#Pacific%20Ocean";
const testLabel = "Example Class";
const testLabel2 = "Other Class";

const exampleUrlList = [
  "http://example.com/sparql",
  "http://example.net/sparql",
  "http://example.org/sparql",
  "http://example.edu/sparql"
];

describe('SparqlClass.ts', () =>
{
  describe('constructor and value assignments', () => 
  {
    it('instantiates all attributes', () => 
    {
      const testClass = new SparqlClass(testIRI, 20, true, testLabel);
      expect(testClass).toHaveProperty("_iri",testIRI);
      expect(testClass).toHaveProperty("_elementCount",20);
      expect(testClass).toHaveProperty("_hasSubclasses",true);
      expect(testClass).toHaveProperty("_label",testLabel);
    });

    it('uses working getters and setter assignments', () =>
    {
      const testClass = new SparqlClass(testIRI, null, false, testLabel);

      expect(testClass.elementCount).toBeNull();
      testClass.elementCount = 10;
      expect(testClass.elementCount).toEqual<Number>(10);
      testClass.elementCount++;
      expect(testClass.elementCount).toEqual<Number>(11);

      expect(testClass.hasSubclasses).toBe(false);
      testClass.hasSubclasses = true;
      expect(testClass.hasSubclasses).toBe(true);
    });
  });

  describe('SPARQL endpoints', () =>
  {
    it('saves multiple endpoints', () => 
    {
      const testClass = new SparqlClass(testIRI,100,true);
      for (const endpoint of exampleUrlList)
        testClass.addEndpoint(endpoint);
      for (const endpoint of exampleUrlList)
        expect(testClass.getEndpoints()).toContain(endpoint);
    });

    it('saves every endpoint once', () =>
    {
      const testClass = new SparqlClass(testIRI2,null,false);
      for (let i=0; i<3; i++)
        testClass.addEndpoint("http://example.com");

      const iterator = testClass.getEndpoints();
      expect(iterator.next().done).toBeFalsy();
      expect(iterator.next().done).toBe(true);
    });

    it('removes endpoints', () => {
      const testClass = new SparqlClass(testIRI,null,false);
      for (const url of exampleUrlList) {
        testClass.addEndpoint(url);
        testClass.deleteEndpoint(url);
      }
      expect(testClass.getEndpoints().next().done).toBe(true);
    });
  });

  describe('merging multiple classes', () =>
  {
    it('preserves the correct label', () => {
      const test1 = new SparqlClass(testIRI, null, false, testLabel);
      const test2 = new SparqlClass(testIRI, null, false);
      const test3 = new SparqlClass(testIRI, null, true, testLabel2);
      
      test1.merge(test2)
      expect(test1).toHaveProperty("label",testLabel);
      expect(test1).toHaveProperty("hasSubclasses",false)
      test2.merge(test1)
      expect(test2).toHaveProperty("label",testLabel);
      expect(test2).toHaveProperty("hasSubclasses",false)

      test1.merge(test3)
      expect(test1).toHaveProperty("label",testLabel);
      expect(test1).toHaveProperty("hasSubclasses",true)
      test3.merge(test1)
      expect(test3).toHaveProperty("label",testLabel2);
      expect(test3).toHaveProperty("hasSubclasses",true)
    });
    it('combines both endpoint lists', () => {
      const test1 = new SparqlClass(testIRI, null, false, testLabel);
      const test2 = new SparqlClass(testIRI, null, false);
      const test3 = new SparqlClass(testIRI, null, false);
      const test4 = new SparqlClass(testIRI, null, false);
      const classes = [test1,test2];

      for (let i=0; i<exampleUrlList.length; i++) {
        classes[i%2].addEndpoint(exampleUrlList[i]);
      }

      test1.merge(test2);
      test2.merge(test1);
      test3.merge(test4);

      for (const e of exampleUrlList) {
        expect(test1.hasEndpoint(e)).toBe(true);
        expect(test2.hasEndpoint(e)).toBe(true);
        expect(test3.hasEndpoint(e)).toBe(false);
      }
    });
    it('sums up the instance counters', () => {
      const test1 = new SparqlClass(testIRI, 100, false, testLabel);
      const test2 = new SparqlClass(testIRI, 120, false);

      test1.merge(test2);
      expect(test1.elementCount).toBe(220);

      test1.addEndpoint(exampleUrlList[0]);
      test2.addEndpoint(exampleUrlList[1]);

      test1.merge(test2);
      expect(test1.elementCount).toBe(340);

      test1.merge(test2);
      expect(test1.elementCount).toBe(340);
      
      test2.merge(test1);
      expect(test2.elementCount).toBe(340);
      
    });
    it('sets counter to null in undefined cases', () => {
      const test1 = new SparqlClass(testIRI, 100, false, testLabel);
      const test2 = new SparqlClass(testIRI, null, true);

      test2.merge(test1);
      expect(test2.elementCount).toBeNull();

      test1.merge(test2);
      expect(test1.elementCount).toBeNull();

      const test3 = new SparqlClass(testIRI, 0, false);
      const test4 = new SparqlClass(testIRI, 0, true);

      test3.merge(test4);
      expect(test3.elementCount).toBe(0);

      test3.addEndpoint(exampleUrlList[0]);
      test3.addEndpoint(exampleUrlList[1]);
      test4.addEndpoint(exampleUrlList[1]);
      test4.addEndpoint(exampleUrlList[2]);

      test3.merge(test4);
      expect(test3.elementCount).toBeNull();
      
      test4.merge(test3);
      expect(test4.elementCount).toBeNull();
    });
    it('refuses to merge classes with different IRIs', () => {
      const test1 = new SparqlClass(testIRI, 10, true, testLabel);
      const test2 = new SparqlClass(testIRI2, 20, false, testLabel);

      expect(() => test1.merge(test2)).toThrowError("IRI");
      expect(() => test2.merge(test1)).toThrowError("IRI");
    });
  });
});
