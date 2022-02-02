/**
 * Contains generic RDF-Objects with an optional label and an attribute list
 */
export class SparqlObject {
  private readonly _iri: string;
  private _label: string;
  private _hasLabel: boolean;
  private _hasProps: boolean;
  private _attributes: Map<string, Map<string, SparqlObject | null>>;
  private _predicateObjects: Map<string, SparqlObject>;

  static readonly prefixMap = new Map([
    ["rdfs", "http://www.w3.org/2000/01/rdf-schema#"],
    ["rdf", "http://www.w3.org/1999/02/22-rdf-syntax-ns#"],
    ["xsd", "http://www.w3.org/2001/XMLSchema#"],
    ["owl", "http://www.w3.org/2002/07/owl#"],
    ["foaf", "http://xmlns.com/foaf/0.1/"],
    ["dc", "http://purl.org/dc/elements/1.1/"]
  ]);
  static temporaryAbbreviationsCount = 0;

  /**
   * Creates a new SparqlObject
   * @param iri unique IRI of the object
   * @param label human-readable label; if omitted, a unique label is created by replacing the prefix of the IRI
   */
  constructor(iri: string, label?: string) {
    this._iri = iri;
    this._hasLabel = label != null;
    this._label = label || SparqlObject.shortenPrefixName(iri);
    this._attributes = new Map();
    this._hasProps = false;
    this._predicateObjects = new Map();
  }

  /**
   * @returns the unique IRI of the object
   */
  public get iri(): string {
    return this._iri;
  }

  /**
   * @returns a human-readable form of the object
   */
  public get label(): string {
    return this._label;
  }

  /**
   * Warning: label can get lost on merge of two SparqlClasses (label of caller "this" preferred)
   * @see SparqlClass.merge
   * @param value new label to set
   */
  public set label(value: string) {
    this._label = value;
    this._hasLabel = true;
  }

  /**
   * @returns if a user defined label was given
   */
  public get hasLabel(): boolean {
    return this._hasLabel;
  }

  /**
   * @returns if there exist properties for this object
   */
  public get hasProps(): boolean {
    return this._hasProps || this._attributes.size > 0;
  }

  /**
   * @param value if the object has properties
   */
  public set hasProps(value: boolean) {
    this._hasProps = value;
  }

  /**
   * Returns all attributes of this object
   * @returns a map of predicate IRIs and a set of all associated objects/literals
   */
  public getAttributes(): ReadonlyMap<SparqlObject, ReadonlySet<SparqlObject | string>> {
    const attributeMap: Map<SparqlObject, ReadonlySet<SparqlObject | string>> = new Map();
    for (const attribute of this._attributes.keys()) {
      attributeMap.set(this._predicateObjects.get(attribute)!, this.getAttributesOfProperty(attribute));
    }
    return attributeMap;
  }

  /**
   * Returns all objects or literals that are associated with this object by a given property
   * @param predicateIri IRI of the SparqlProperty that is queried (as in a subject, predicate, object triple)
   * @returns a set of the objects of all known triples that consist of this SparqlObject as subject and the given property
   */
  public getAttributesOfProperty(predicateIri: string): ReadonlySet<SparqlObject | string> {
    const attributes = new Set<SparqlObject | string>();
    for (const [k, v] of this._attributes.get(predicateIri)?.entries() || []) {
      attributes.add(v == null ? k : v);
    }
    return attributes;
  }

  /**
   * Adds an attribute defined by a triple (subject, predicate, object)
   * Literals are added as key in the associated submap and SPARQL objects are
   * stored as key(=IRI)/value(=SparqlObject) pairs.
   * If the same object already exists, the hasProps attribute has to be reevaluated
   * @param predicate The property this object belongs to
   * @param object Related object to add; either an Object or a literal string
   */
  public addAttributeOfProperty(predicate: SparqlObject, object: SparqlObject | string): void {
    const key = object instanceof SparqlObject ? object.iri : object;
    const value = object instanceof SparqlObject ? object : null;
    this._predicateObjects.set(predicate.iri, predicate);
    if (this._attributes.has(predicate.iri)) {
      const attribute = this._attributes.get(predicate.iri);
      if (attribute?.get(key)?._hasProps && object instanceof SparqlObject) {
        object._hasProps = true;
      }
      attribute?.set(key, value);
    } else {
      this._attributes.set(predicate.iri, new Map<string, SparqlObject | null>([[key, value]]));
    }
  }

  /**
   * Compares this object with another one by name
   * @param other Other SparqlObject to compare to
   * @returns value in [-1,0,1] for comparison or sorting
   */
  public compare(other: SparqlObject): number {
    let cmp: number = this.label.localeCompare(other.label);
    if (cmp === 0) {
      cmp = this.iri.localeCompare(other.iri);
    }
    return cmp
  }

  /**
   * Replaces the start of an IRI with a known prefix or a temporary one
   * @param resourceIri the full IRI to be abbreviated
   * @returns a unique abbreviation of the IRI in the style of RDF-Prefixes
   */
  public static shortenPrefixName(resourceIri: string): string {
    const reURI = new RegExp("^https?:\\/\\/[\\[\\]a-zA-Z0-9\\.\\-_~:%!$&'()*+,;=]+\\/");
    const positionOfPrefixEnd = Math.max(resourceIri.lastIndexOf('/'), resourceIri.lastIndexOf('#')) + 1;
    const guessedPrefix = resourceIri.substring(0, positionOfPrefixEnd);

    if (!reURI.test(guessedPrefix) || resourceIri.length === positionOfPrefixEnd || resourceIri.endsWith("/en") || resourceIri.endsWith(".htm") || resourceIri.endsWith(".html")) {
      return resourceIri;
    }

    let shortPrefix;
    for (const [knownShortPrefix, knownPrefixUri] of SparqlObject.prefixMap) {
      if (guessedPrefix === knownPrefixUri) {
        shortPrefix = knownShortPrefix;
        break;
      }
    }

    if (!shortPrefix) {
      shortPrefix = SparqlObject.createTemporaryAbbreviation(guessedPrefix);
    }
    return shortPrefix + ':' + resourceIri.substring(positionOfPrefixEnd);
  }

  /**
   * Creates temporary abbreviations of IRIs with consecutive numbers
   * @param prefixIri the assumed prefix IRI up to the last character to be replaced
   * @returns a short prefix identifier which is placed in the map of prefixes for future replacements
   */
  private static createTemporaryAbbreviation(prefixIri: string): string {
    const shortPrefix = "pre" + SparqlObject.temporaryAbbreviationsCount++;
    SparqlObject.prefixMap.set(shortPrefix, prefixIri);
    return shortPrefix;
  }
}
