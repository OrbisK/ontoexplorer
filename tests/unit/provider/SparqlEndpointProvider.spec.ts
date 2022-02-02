import SparqlEndpointProvider from "@/providers/SparqlEndpointProvider";
import {SparqlEndpoint} from "@/model/SparqlEndpoint";

describe('SparqlEndpointProvider.ts', () => {
    it('addEndpoint', () => {
        const endpoint = new SparqlEndpoint ("Test", false, "https://pastebin.com/raw/JVAqZPqd");
        const result = SparqlEndpointProvider.addEndpoint(endpoint);

        expect(result).toBe("Test");
    });
    
    it('getCurrentConfigString', () => {
        const endpointArray = [{"name": "Test", "url": "https://pastebin.com/raw/JVAqZPqd", "usesOWL": false, "headers":{}}];
        const result = SparqlEndpointProvider.getCurrentConfigString();

        expect(result).toBe(JSON.stringify(endpointArray));

    });
    
    it('editEndpoint', () => {
        const endpoint = new SparqlEndpoint ("Edited", false, "https://pastebin.com/raw/JVAqZPqd")
        const result = SparqlEndpointProvider.editEndpoint(e => e.name == "Test", endpoint);

        expect(result).toBe("Edited");
    });

})