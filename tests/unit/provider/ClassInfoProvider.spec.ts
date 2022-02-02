import classInfo from "@/providers/ClassInfoProvider"
import { SparqlClass } from "@/model/SparqlClass";

const exampleIRI = "http://example.com/sparql";

describe('ClassInfoProvider.ts', () => {
  describe('class index', () => {
    it('saves the first instance of a class', () => {
      const test1 = new SparqlClass(exampleIRI, null, false, "Test 1");
      const test2 = new SparqlClass(exampleIRI, null, false, "Test 2");
      const test3 = new SparqlClass(exampleIRI, null, false, "Test 3");

      expect(classInfo.getCanonical(test1)).toBe(test1);
      expect(classInfo.getCanonical(test2)).toBe(test1);
      expect(classInfo.getCanonical(test3)).toBe(test1);

      const test4 = new SparqlClass(exampleIRI+"123", null, false, "Test 1");
      expect(classInfo.getCanonical(test4)).toBe(test4);
    });

    it('removes all classes when cleared', () => {
      const test1 = new SparqlClass(exampleIRI, 120, false);
      const test2 = new SparqlClass(exampleIRI, 130, false);
      
      classInfo.getCanonical(test1);
      classInfo.clearIndex();
      expect(classInfo.getCanonical(test2)).toBe(test2);
      expect(classInfo.getCanonical(test1)).not.toBe(test1);
    })
  });

  describe('selected class storage', () => {
    it('saves a selected class if a canonical class exists', () => {
      const test = new SparqlClass(exampleIRI, 200, false);

      classInfo.clearIndex();
      classInfo.setCurrent(exampleIRI);
      expect(classInfo.current.value).toBeNull();

      classInfo.getCanonical(test);
      classInfo.setCurrent(exampleIRI);
      expect(classInfo.current.value).toStrictEqual(test);

      classInfo.setCurrent(null);
      expect(classInfo.current.value).toBeNull();
    });
  });
});
