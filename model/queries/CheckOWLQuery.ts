export function getCheckOWLQuery() {
  return `PREFIX owl: <http://www.w3.org/2002/07/owl#>
          SELECT ?s WHERE { ?s a owl:Class . FILTER (?s != owl:Thing && ?s != owl:Nothing) } LIMIT 1`
}
