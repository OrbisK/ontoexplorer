import { isProxy, toRaw } from 'vue'
// @ts-expect-error
import { ParsingClient } from 'sparql-http-client'
// @ts-expect-error
import type { ResultRow } from 'sparql-http-client'
import classInfo from '../providers/ClassInfoProvider'
import SparqlQueries from '@/model/SparqlQueries'
import { SparqlClass } from '@/model/SparqlClass'
import { SparqlObject } from '@/model/SparqlObject'
import { SparqlTriple } from '@/model/SparqlTriple'

export enum SparqlVersion {
  SPARQL_10,
  SPARQL_11,
}
/**
 * Class to internally represent a SPARQL endpoint with its important properties and current status,
 * while also exposing functions to query data with pre-written queries.
 */
export class SparqlEndpoint {
  name: string
  enabled: boolean
  url: string

  client: ParsingClient | null = null
  version: SparqlVersion = SparqlVersion.SPARQL_10
  supportsOWL: boolean = false
  authorization: AuthData | null = null
  customHeaders: Map<string, string> = new Map<string, string>()

  constructor(name: string, enabled: boolean, url: string) {
    this.name = name
    this.enabled = enabled
    this.url = url
  }

  /**
   * Runs several checks against the endpoint to determine and internally set availability, version and compatibility with OWL.
   * @returns {Promise<boolean>} A promise to the current availability of the endpoint.
   */
  async doChecks(): Promise<boolean> {
    const abortController = new AbortController()
    const timeoutId = setTimeout(() => abortController.abort(), 5000)

    const [res, err] = await SparqlEndpoint.promiseHelper(fetch(this.url, {
      headers: { Accept: 'application/rdf+xml' },
      method: 'GET',
      signal: abortController.signal,
    }))
    clearTimeout(timeoutId)
    if (err)
      return false
    const text = await res.text()

    if (text.length > 0 && text.charAt(0) === '<') {
      if (isProxy(this))
        toRaw(this).version = SparqlVersion.SPARQL_11
      else
        this.version = SparqlVersion.SPARQL_11
    }

    const headers = new Headers()
    for (const [name, value] of this.customHeaders)
      headers.set(name, value)

    const sparqlClient = this.authorization
      ? new ParsingClient({
        endpointUrl: this.url,
        headers,
        user: this.authorization.username,
        password: this.authorization.password,
      })
      : new ParsingClient({ endpointUrl: this.url, headers })

    if (isProxy(this))
      toRaw(this).client = sparqlClient
    else
      this.client = sparqlClient

    const checkOwl = await this.client?.query.select(SparqlQueries.getCheckOWLQuery())

    const owlCheck = (checkOwl != null) && checkOwl.length > 0

    if (isProxy(this))
      toRaw(this).supportsOWL = owlCheck
    else
      this.supportsOWL = owlCheck

    return true
  }

  /**
   * Fetches either the root classes or all classes of the endpoint depending on compatibility with OWL.
   * @returns {Promise<SparqlClass[]>} A promise to an array of SparqlClasses fetched from the endpoint
   */
  async getClasses(): Promise<SparqlClass[]> {
    const query = this.supportsOWL ? SparqlQueries.getOWLRootClassesQuery() : SparqlQueries.getAllClassesQuery()
    const result = await this.client?.query.select(query)

    return SparqlEndpoint.parseClassList(result || [], this.url)
  }

  /**
   * Fetches all subclasses of a given class URI
   * @returns {Promise<SparqlClass[]>} A promise to an array of SparqlClasses fetched from the endpoint
   */
  async getSubclasses(classUri: string): Promise<SparqlClass[]> {
    const res = await this.client?.query.select(SparqlQueries.getSubclassesQuery(classUri))
    return SparqlEndpoint.parseClassList(res || [], this.url)
  }

  /**
   * Fetches all classes of a given instance
   * @param instanceIri the iri of the given class
   * @returns A promise to an array of SparqlObjekt fetched from the endpoint
   */
  async getClassesOf(instanceIri: string): Promise<SparqlObject[]> {
    const classes: SparqlObject[] = []
    const query = SparqlQueries.getClassesOfQuery(instanceIri)
    const res = await this.client?.query.select(query)
    for (const obj of res!)
      classes.push(new SparqlObject(obj.class.value, obj.classLabel?.value))

    return classes
  }

  /**
   * Fetches all instances of a given class
   * @param classIri Parent class IRI whose instances are searched
   * @param limit Maximum number of results
   * @param offset Number of results to skip at the beginning
   */
  async getInstancesOf(classIri: string, limit: number, offset: number): Promise<Array<SparqlObject>> {
    if (limit <= 0 || offset < 0)
      return []

    const queryBuilder = (this.version == SparqlVersion.SPARQL_11) ? SparqlQueries.getInstancesOfQuery : SparqlQueries.getCompatibilityInstancesOfQuery
    const res = await this.client?.query.select(queryBuilder(classIri, limit, offset))
    const instances = new Array<SparqlObject>()
    for (const node of res || []) {
      if (instances.find(e => e.iri == node.instance.value) == undefined)
        instances.push(new SparqlObject(node.instance.value, node.instanceLabel?.value))
    }
    return instances
  }

  /**
   * Fetches a list of all possible instance properties for a given class
   * @param classIri IRI of the requested class
   * @returns {SparqlObject[]} Array of properties for this class
   */
  async getClassProperties(classIri: string): Promise<SparqlObject[]> {
    const properties = []
    const query = SparqlQueries.getClassPropertiesQuery(classIri)
    const res = await this.client?.query.select(query)
    for (const obj of res!)
      properties.push(new SparqlObject(obj.p.value))

    return properties
  }

  /**
   * Fetches a list of instance properties for a given IRI
   * @param instance requested instance
   * @returns {SparqlTriple[]} List of triples for this instance
   */
  async getInstanceProperties(instance: SparqlObject): Promise<SparqlTriple[]> {
    const triples = []
    const query = SparqlQueries.getInstancePropertiesQuery(instance.iri, this.version !== SparqlVersion.SPARQL_11)
    const res = await this.client?.query.select(query)
    for (const obj of res!) {
      let object: string | SparqlObject
      if (obj.o?.termType == 'Literal') {
        object = obj.o.value
      }
      else if (obj.o?.termType == 'NamedNode') {
        object = new SparqlObject(obj.o.value, obj.oLabel?.value)
        object.hasProps = obj.testOProp != null
      }
      else {
        console.error('Unknown termType of Object: ')
        console.error(obj.o)
        object = ''
      }
      triples.push(new SparqlTriple(
        instance,
        new SparqlObject(obj.p.value, obj.pLabel?.value),
        object,
      ))
    }
    return triples
  }

  /**
   * Parses a list of classes from an endpoint response
   * @returns {SparqlClass[]} List of parsed classes
   * @param result Array of result rows from a request
   * @param endpointUrl URL of the corresponding endpoint
   * @private
   */
  private static parseClassList(result: ResultRow[], endpointUrl: string): SparqlClass[] {
    const resultClasses: SparqlClass[] = []
    for (const node of result) {
      const count = node.count ? Number.parseInt(node.count.value) : null
      if (node.classLabel) {
        const clazz = new SparqlClass(node.class.value, count, node.testSub != null, node.classLabel.value)
        clazz.addEndpoint(endpointUrl)
        resultClasses.push(classInfo.getCanonical(clazz))
      }
      else {
        const clazz = new SparqlClass(node.class.value, count, node.testSub != null)
        clazz.addEndpoint(endpointUrl)
        resultClasses.push(classInfo.getCanonical(clazz))
      }
    }
    return resultClasses
  }

  private static promiseHelper(promise: Promise<any>) {
    return promise.then((data) => {
      return [data, null]
    }).catch(err => [null, err])
  }
}

export class AuthData {
  username: string
  password: string

  constructor(username: string, password: string) {
    this.username = username
    this.password = password
  }
}
