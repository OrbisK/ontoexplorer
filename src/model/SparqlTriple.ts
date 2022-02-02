import {SparqlObject} from "@/model/SparqlObject";

export class SparqlTriple {
  readonly subject: SparqlObject;
  readonly predicate: SparqlObject;
  readonly object: string | SparqlObject;


  constructor(subject: SparqlObject, predicate: SparqlObject, object: string | SparqlObject) {
    this.subject = subject;
    this.predicate = predicate;
    this.object = object;
  }
}
