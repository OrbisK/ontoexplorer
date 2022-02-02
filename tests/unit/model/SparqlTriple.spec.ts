import { SparqlObject } from "@/model/SparqlObject";
import { SparqlTriple } from "@/model/SparqlTriple";

describe('SparqlTriple.ts', () => {
  it('treats literals and strings the same', () => {
    const subject = new SparqlObject("http://example.com/subject");
    const predicate = new SparqlObject("http://example.com/property");
    const object = new SparqlObject("http://example.com/object")
    const objectLiteral = "Literal";

    const tripleObject = new SparqlTriple(subject,predicate,object);
    const tripleLiteral = new SparqlTriple(subject,predicate,objectLiteral);

    expect(tripleObject).toEqual({subject: subject, predicate: predicate, object: object});
    expect(tripleLiteral).toEqual({subject: subject, predicate: predicate, object: objectLiteral});
  });
});
