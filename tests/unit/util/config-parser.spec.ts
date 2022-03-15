import {parseEndpointConfiguration, ParsingErrorCause} from "@/util/config-parser";
import {AuthData, SparqlEndpoint} from "@/model/SparqlEndpoint";

const exampleConfig = `[
  {
    "name": "DBpedia",
    "url": "https://dbpedia.org/sparql",
    "usesOWL": true
  },
  {
    "name": "Wikidata",
    "url": "https://query.wikidata.org/bigdata/namespace/wdq/sparql",
    "store_url": "https://query.wikidata.org/bigdata/namespace/wdq/sparql/test123",
    "usesOWL": false,
    "headers": {
      "TEST_HEADER": "HEADER_VALUE",
      "ALSO_TEST": "ANOTHERVALUE"
    }
  },
  {
    "name": "Pfarrerbuch Sachsen",
    "url": "http://kps-data.pfarrerbuch.de/sparql",
    "update_url": "http://kps-data.pfarrerbuch.de/sparql/uo",
    "usesOWL": true,
    "authorization": {
      "user": "user123",
      "password": "test123"
    }
  }
]`;

test('parse valid configuration', () => {
  const expected = [
    new SparqlEndpoint("DBpedia", false, "https://dbpedia.org/sparql"),
    new SparqlEndpoint("Wikidata", false, "https://query.wikidata.org/bigdata/namespace/wdq/sparql"),
    new SparqlEndpoint("Pfarrerbuch Sachsen", false, "http://kps-data.pfarrerbuch.de/sparql")
  ];
  expected[1].customHeaders.set("TEST_HEADER", "HEADER_VALUE");
  expected[1].customHeaders.set("ALSO_TEST", "ANOTHERVALUE");
  expected[2].authorization = new AuthData("user123", "test123");
  expect(parseEndpointConfiguration(exampleConfig)).toMatchObject(expected);
});

test('parse invalid json', () => {
  let thrownError;
  try {
    parseEndpointConfiguration("f239f023")
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toHaveProperty("errorCause", ParsingErrorCause.INVALID_JSON);
});

test('parse root not array', () => {
  let thrownError;
  try {
    parseEndpointConfiguration('{"name":"test"}')
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toHaveProperty("errorCause", ParsingErrorCause.INVALID_STRUCTURE);
});

test('parse config with missing url', () => {
  let thrownError;
  try {
    parseEndpointConfiguration('[{"name":"test"}]')
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toHaveProperty("errorCause", ParsingErrorCause.MISSING_DATA);
});

test('parse config with wrong type for url', () => {
  let thrownError;
  try {
    parseEndpointConfiguration('[{"name":"test", "url": 1234}]')
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toHaveProperty("errorCause", ParsingErrorCause.INVALID_STRUCTURE);
});