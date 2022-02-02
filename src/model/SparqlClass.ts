import {SparqlObject} from "./SparqlObject";

/**
 * Class containing an rdf:type-Class with its unique IRI, a human-readable label, the number of its instances and the endpoints on which the class was found
 */
export class SparqlClass extends SparqlObject {
  private _elementCount: number | null;
  private _endpoints: Set<string>;
  private _hasSubclasses: boolean;

  /**
   * Creates a SparqlClass element
   * @param iri unique IRI of the class
   * @param elementCount number of instances in the graph
   * @param label human-readable label; if omitted, a unique label is created by replacing the prefix of the IRI
   */
  constructor(iri: string, elementCount: number | null, hasSubclasses: boolean, label?: string) {
    super(iri, label);
    this._elementCount = elementCount;
    this._endpoints = new Set();
    this._hasSubclasses = hasSubclasses;
  }

  /**
   * @returns the number of class instances
   */
  public get elementCount(): number | null {
    return this._elementCount;
  }

  /**
   * @param value the number of class instances
   */
  public set elementCount(value: number | null) {
    this._elementCount = value;
  }

  /**
   * @returns if the class has subclasses
   */
  public get hasSubclasses(): boolean {
    return this._hasSubclasses;
  }

  /**
   * @param value if the class has subclasses
   */
  public set hasSubclasses(value: boolean) {
    this._hasSubclasses = value;
  }

  /**
   * @returns an IterableIterator of all endpoint-IRIs
   */
  public getEndpoints(): IterableIterator<string> {
    return this._endpoints.values();
  }

  /**
   * Checks if an endpoint is part of the endpoint list
   * @param url URL of the endpoint to check
   * @returns if the selected endpoint has this class
   */
  public hasEndpoint(url: string) {
    return this._endpoints.has(url);
  }

  /**
   * Adds an IRI to the list of endpoints on which the class was found
   * @param value endpoint to add
   */
  public addEndpoint(value: string) {
    this._endpoints.add(value);
  }

  /**
   * Removes an IRI from the list of endpoints associated with the class
   * @param value endpoint to remove
   * @returns if the endpoint was found and removed
   */
  public deleteEndpoint(value: string): boolean {
    return this._endpoints.delete(value);
  }

  /**
   * Update class, so that it contains all information of the second class
   * IRIs of both classes should be the same
   * @param other Information of this class is pulled into the called class
   * (value remains unchanged)
   * @throws Error on merging different IRIs
   */
  public merge(other: SparqlClass) {
    if (this.iri != other.iri) {
      throw new Error('Non-matching IRIs');
    }

    if (this.elementCount != null && other.elementCount != null) {
      if ([...this._endpoints].filter(e => other.hasEndpoint(e)).length == 0) {
        this.elementCount += other.elementCount;
      } else if ([...this._endpoints].filter(e => !other.hasEndpoint(e)).length == 0) {
        this.elementCount = other.elementCount;
      } else if ([...other._endpoints].filter(e => !this.hasEndpoint(e)).length > 0) {
        this.elementCount = null;
      }
    } else {
      this.elementCount = null;
    }

    this._hasSubclasses = this._hasSubclasses || other._hasSubclasses;

    for (const newEndpoint of other._endpoints) {
      this.addEndpoint(newEndpoint);
    }

    if (!this.hasLabel && other.hasLabel) {
      this.label = other.label;
    }
  }
}

