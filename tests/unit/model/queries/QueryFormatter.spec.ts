import { minimized } from "@/model/queries/QueryFormatter";

const testQueries: Array<[string, string]> = [
  [`
    SELECT  ?s ?p ?o  WHERE {
      ?s   ?p    ?o .
    }
    LIMIT  10`, 
    "SELECT ?s ?p ?o WHERE { ?s ?p ?o . } LIMIT 10"
  ],[
    "                                                                ",""
  ],[
    "\n\n\n\n\n\n\n\n\n\n\n\n",""
  ],[
    "",""
  ],[
    " ",""
  ],[
    "SELECT", "SELECT"
  ]
];

describe('QueryFormatter.ts', () =>
{
  it('replaces all spaces and newlines by single spaces', () =>
  {
    for (const [key, val] of testQueries) {
      expect(minimized(key)).toEqual(val);
    }
  });
  it('returns normal forms', () =>
  {
    for (const [key, _val] of testQueries) {
      const min = minimized(key);
      expect(minimized(min)).toEqual(min);
    }
  });
});
