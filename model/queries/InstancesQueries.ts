import { minimized } from './QueryFormatter'

/**
 * Parameterized query for instances of a class
 * @param classIri IRI of the parent class
 * @param limit LIMIT statement to set a maximum number of result rows
 * @param offset OFFSET statement to skip this amount at the beginning of the query
 * @returns A formatted and minimized SPARQL-query for instances of the given class
 */
export function getInstancesOfQuery(classIri: string, limit: number, offset: number) {
  return (minimized(
    `
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT ?instance (SAMPLE(?iLabel) AS ?instanceLabel) WHERE {
  { SELECT DISTINCT ?instance WHERE {
    ?instance a <${classIri}>
  } LIMIT ${limit} OFFSET ${offset} }
  OPTIONAL {
    ?instance rdfs:label ?iLabel .
    FILTER langMatches( lang(?iLabel), "EN" )
  }
  OPTIONAL {?instance rdfs:label ?iLabel }
}
GROUP BY ?instance ?instanceLabel
`,
  ))
}

/**
 * Parameterized query for instances of a class (for compatibility with redundant labels)
 * @param classIri IRI of the parent class
 * @param limit LIMIT statement to set a maximum number of returned instances (but with multiple labels)
 * @param offset OFFSET statement to skip this amount at the beginning of the query
 * @returns A formatted and minimized SPARQL-query for instances of the given class
 */
export function getCompatibilityInstancesOfQuery(classIri: string, limit: number, offset: number) {
  return (minimized(
    `
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT ?instance ?instanceLabel WHERE {
  { SELECT DISTINCT ?instance WHERE {
    ?instance a <${classIri}>
  } LIMIT ${limit} OFFSET ${offset} }
  OPTIONAL {?instance rdfs:label ?instanceLabel }
}
`,
  ))
}
