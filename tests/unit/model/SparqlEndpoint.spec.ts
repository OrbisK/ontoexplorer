import {SparqlEndpoint, SparqlVersion} from "@/model/SparqlEndpoint";
import {SparqlClass} from "@/model/SparqlClass";

global.fetch = jest.fn();
global.Headers = jest.fn();

beforeEach(() => {
  (fetch as jest.Mock).mockClear();
});

describe('SparqlEndpoint.ts', () => {


  describe("endpoint checks", () => {

    it("sparql 1.0", async () => {

      (fetch as jest.Mock).mockResolvedValueOnce({text: () => ""});


      const endpoint = new SparqlEndpoint("Test", false, "https://pastebin.com/raw/JVAqZPqd");
      const result = await endpoint.doChecks();

      expect(result).toBe(true);
      expect(endpoint.version).toBe(SparqlVersion.SPARQL_10);
    });

    it("sparql 1.1", async () => {

      (fetch as jest.Mock).mockResolvedValueOnce({text: () => `<?xml version="1.0" encoding="utf-8" ?>
        <rdf:RDFxmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#"/>`});

      const endpoint = new SparqlEndpoint("Test", false, "https://pastebin.com/raw/JVAqZPqd");
      const result = await endpoint.doChecks();

      expect(result).toBe(true);
      expect(endpoint.version).toBe(SparqlVersion.SPARQL_11);
    });

    it("endpoint returns error", async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error());
      const endpoint = new SparqlEndpoint("Test", false, "http://ontoexplorer.tk:81/sparql");
      const result = await endpoint.doChecks();
      expect(result).toBe(false);
    });

    it("get classes", async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({text: () => ""});


      const endpoint = new SparqlEndpoint("Test", false, "https://pastebin.com/raw/GAYkQfLw");
      const result = await endpoint.doChecks();
      expect(result).toBe(true);

      const classes = await endpoint.getClasses();
      expect(classes.length).toBe(6);
      expect(classes[0]).toBeInstanceOf(SparqlClass);

    });

  });
});