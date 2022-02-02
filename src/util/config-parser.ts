import {AuthData, SparqlEndpoint} from "@/model/SparqlEndpoint";

export enum ParsingErrorCause {
  INVALID_JSON,
  INVALID_STRUCTURE,
  MISSING_DATA
}

export class ParsingError extends Error {

  readonly cause: ParsingErrorCause;

  constructor(cause: ParsingErrorCause, message = "") {
    super();
    this.cause = cause;
    this.message = message || ParsingErrorCause[cause];
  }

}

export function parseEndpointConfiguration(configString: string) {
  let json;
  try {
    json = JSON.parse(configString);
  } catch (e) {
    throw new ParsingError(ParsingErrorCause.INVALID_JSON, "Could not parse JSON String");
  }

  if (!Array.isArray(json)) throw new ParsingError(ParsingErrorCause.INVALID_STRUCTURE, "Root element of the configuration is not an array");

  const endpoints = [];

  let i = 0;

  for (const endpoint of json) {
    if (!("name" in endpoint) || !("url" in endpoint)) {
      throw new ParsingError(ParsingErrorCause.MISSING_DATA, `Every endpoint needs a name and url (Endpoint #${i})`);
    }
    const name = endpoint['name'];
    const url = endpoint['url'];
    const usesOWL = endpoint['usesOWL'] || false;

    if (!(typeof name == 'string')) throw new ParsingError(ParsingErrorCause.INVALID_STRUCTURE, `Endpoint name should be a string (Endpoint #${i})`);
    if (!(typeof url == 'string')) throw new ParsingError(ParsingErrorCause.INVALID_STRUCTURE, `Endpoint url should be a string (${name})`);
    if (!(typeof usesOWL == 'boolean')) throw new ParsingError(ParsingErrorCause.INVALID_STRUCTURE, `Endpoint usesOWL attribute should be a boolean (${name})`);

    if (endpoint['headers']) {
      if (!(typeof endpoint['headers'] == 'object')) throw new ParsingError(ParsingErrorCause.INVALID_STRUCTURE, `Headers should be an object (${name})`);
      if (Object.values(endpoint['headers']).some(x => typeof x != 'string')) throw new ParsingError(ParsingErrorCause.INVALID_STRUCTURE, `Header values should be strings (${name})`);
    }

    if (endpoint['authorization']) {
      if (!endpoint['authorization']['user']) throw new ParsingError(ParsingErrorCause.INVALID_STRUCTURE, `Authorization is missing user (${name})`);
      if (!endpoint['authorization']['password']) throw new ParsingError(ParsingErrorCause.INVALID_STRUCTURE, `Authorization is missing user (${name})`);
      if (!(typeof endpoint['authorization']['user'] == 'string')) throw new ParsingError(ParsingErrorCause.INVALID_STRUCTURE, `User should be a string (${name})`);
      if (!(typeof endpoint['authorization']['password'] == 'string')) throw new ParsingError(ParsingErrorCause.INVALID_STRUCTURE, `Password should be a string (${name})`);
    }

    const user = endpoint['authorization'] ? endpoint['authorization']['user'] : undefined;
    const password = endpoint['authorization'] ? endpoint['authorization']['password'] : undefined;


    const ep = new SparqlEndpoint(name, false, url);
    ep.customHeaders = endpoint['headers'] ? new Map<string, string>(Object.entries(endpoint['headers'])) : new Map<string, string>();
    endpoints.push(ep);
    if (user) {
      ep.authorization = new AuthData(user, password);
    }
    i++;
  }

  return endpoints;

}