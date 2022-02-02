import { SparqlObject } from "@/model/SparqlObject";
import SparqlPropertyProvider from "@/providers/SparqlPropertyProvider";

const testProperty1 = new SparqlObject("http://www.w3.org/1999/02/22-rdf-syntax-ns#type");
const testProperty2 = new SparqlObject("http://www.w3.org/2000/01/rdf-schema#label");

describe('SparqlPropertyProvider.ts', () => {
  it('addProperty', () => {
    const result1 = SparqlPropertyProvider.addProperty(testProperty1);
    const result2 = SparqlPropertyProvider.addProperty(testProperty2);

    expect(result1).toBe("http://www.w3.org/1999/02/22-rdf-syntax-ns#type");
    expect(result2).toBe("http://www.w3.org/2000/01/rdf-schema#label");
  });

  it('getEnabledProperties', () => {
    SparqlPropertyProvider.setPropertyEnabled(testProperty2, true);
    const result = SparqlPropertyProvider.getEnabledProperties();

    expect(result).toEqual([testProperty2])
  });

  it('clearProvider', () => {
    SparqlPropertyProvider.clearProvider();
    const result = SparqlPropertyProvider.state.properties;

    expect(result.size).toBe(0);
  });

})
