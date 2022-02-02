import {minimized} from "./QueryFormatter";

/**
 * Builds a SPARQL-Query to get all outgoing properties with ?p as property IRI and ?o as object IRI or literal.
 * If object and/or property have labels, additional ?pLabel and ?oLabel variables are bound.
 * The optional ?testOProp variable is bound by a random object property, to check if the object has properties on the same endpoint.
 * @param instanceIri the IRI of the subject
 * @param compatibility if the endpoint needs a SPARQL 1.0 compliant query
 * @returns minimized query string
 */
export function getInstancePropertiesQuery(instanceIri: string, compatibility: boolean) {
  return minimized(
    `
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT ?p ?o ${compatibility ? "?oLabel ?pLabel" : "(SAMPLE(?objLabel) AS ?oLabel) (SAMPLE(?preLabel) AS ?pLabel)"} ?testOProp
{ 
  <${instanceIri}> ?p ?o . 
  ${compatibility ?
      `OPTIONAL {?o rdfs:label ?oLabel }
   OPTIONAL {?p rdfs:label ?pLabel }` :
      `OPTIONAL {
    ?o rdfs:label ?oLabel .
    FILTER langMatches( lang(?objLabel), "EN" )
  }
  OPTIONAL {?o rdfs:label ?objLabel }
  OPTIONAL {
    ?p rdfs:label ?pLabel .
    FILTER langMatches( lang(?preLabel), "EN" )
  }
  OPTIONAL {?p rdfs:label ?preLabel }
  `
    }
  OPTIONAL {?o ?testOProp []}
}
`
  );
}
