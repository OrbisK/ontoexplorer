import {minimized} from "./QueryFormatter"

/**
 * SPARQL query to select all rdf:type classes.
 * Should be preferred on endpoints without OWL support
 * @returns minimized SPARQL query
 * @see getOWLRootClassesQuery
 */
export function getAllClassesQuery() {
  return minimized(
    `PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX owl: <http://www.w3.org/2002/07/owl#>
SELECT DISTINCT ?class ?classLabel (count(?s) as ?count) ?testSub WHERE {
  ?s a ?class .
  FILTER (!STRSTARTS(STR(?class),STR(owl:))) .
  OPTIONAL {?class rdfs:subClassOf ?super} .
  FILTER (!BOUND(?super)) .
  OPTIONAL {?class rdfs:label ?classLabel} 
  OPTIONAL {?testSub rdfs:subClassOf ?class}
} GROUP BY ?class ?classLabel ?testSub
`);
}

/**
 * SPARQL query to select all OWL classes.
 * Should be preferred on endpoints with OWL support
 * @returns minimized SPARQL query
 * @see getAllClassesQuery
 */
export function getOWLRootClassesQuery() {
  return minimized(
    `PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX virt: <http://www.openlinksw.com/schemas/virtpivot#>
SELECT DISTINCT ?class (SAMPLE(?cLabel) AS ?classLabel) (count(DISTINCT ?s) as ?count) ?testSub
WHERE { ?class a owl:Class .
        FILTER ( !STRSTARTS(STR(?class),STR(owl:)) &&
                 !STRSTARTS(STR(?class),STR(virt:)) &&
                 !STRSTARTS(STR(?class),"nodeID") )
        OPTIONAL {?class rdfs:subClassOf ?super .
                  FILTER (?super != owl:Thing)}
        FILTER (!BOUND(?super)) .
        OPTIONAL {?class rdfs:label ?cLabel .
                  FILTER (LANG(?cLabel) = "en")}
        OPTIONAL {?class rdfs:label ?cLabel }
        OPTIONAL {?s a ?class}
        OPTIONAL {?testSub rdfs:subClassOf ?class}
} GROUP BY ?class ?classLabel ?testSub
`);
}

/**
 * Parameterized SPARQL query to select all direct subclasses of a class
 * @param selectedRootClass IRI of the root class
 * @returns formatted and minimized query for direct subclasses of a given class
 */
export function getSubclassesQuery(selectedRootClass: string) {
  return minimized(`PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT DISTINCT ?class (SAMPLE(?cLabel) AS ?classLabel) (count(DISTINCT ?s) as ?count) ?testSub
WHERE { ?class rdfs:subClassOf <${selectedRootClass}> .
        OPTIONAL { ?otherSub rdfs:subClassOf <${selectedRootClass}> . 
                   ?class rdfs:subClassOf ?otherSub .
                   FILTER (?otherSub != ?class)}
        FILTER (!BOUND(?otherSub)) .
        OPTIONAL {?class rdfs:label ?cLabel .
                  FILTER (LANG(?cLabel) = "en")}
        OPTIONAL {?class rdfs:label ?cLabel }
        OPTIONAL {?s a ?class}
        OPTIONAL {?testSub rdfs:subClassOf ?class}
} GROUP BY ?class ?classLabel ?testSub`);
}

export function getClassPropertiesQuery(selectedClass: string) {
  return minimized(
    `select distinct ?p where {
  ?instance a <${selectedClass}> ; ?p ?o
}`);
}

/**
 * Parameterized query for classes of an instance
 * @param instanceIri IRI of the instance
 * @returns A formatted and minimized SPARQL-query for classes of the given instance
 */
export function getClassesOfQuery(instanceIri: string) {
  return (minimized(
    `
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT DISTINCT ?class ?classLabel WHERE {
  <${instanceIri}> a ?class .
  OPTIONAL {?class rdfs:label ?classLabel}
}
`
  ));
}
