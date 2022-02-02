import {reactive, readonly} from "vue";
import {parseEndpointConfiguration} from "@/util/config-parser";
import {SparqlEndpoint} from "@/model/SparqlEndpoint";
import Endpoint from "sparql-http-client/Endpoint";

const endpoints: SparqlEndpoint[] = [];

const state = reactive({
  endpoints: endpoints
});

/**
 * Adds an endpoint to the provider
 * @param endpoint New endpoint to add to the provider
 * @returns {string} Name of the added endpoint
 */
const addEndpoint = function (endpoint: SparqlEndpoint) {
  state.endpoints.push(endpoint);
  save();
  return endpoint.name;
}

/**
 * Edits the first endpoint matching the provided filter
 * @param filter Filter to match the endpoints against
 * @returns {string} (New) Name of the edited endpoint
 */
const editEndpoint = function (filter: (e: SparqlEndpoint) => boolean, newEndpoint: SparqlEndpoint) {
  const editIndex = endpoints.findIndex(filter);
  state.endpoints.splice(editIndex, 1, newEndpoint);
  save();
  return state.endpoints[editIndex].name;
}

/**
 * Removes the first endpoint matching the provided filter
 * @param filter Filter to match the endpoints against
 * @returns {SparqlEndpoint|null} Removed endpoint
 */
const removeEndpoint = function (filter: (e: SparqlEndpoint) => boolean) {
  const removedIndex = endpoints.findIndex(filter);
  if (removedIndex != -1) {
    const removed = state.endpoints.splice(removedIndex, 1);
    save();
    return removed[0];
  } else {
    return null;
  }
}

/**
 * Updates the enabled status of first endpoint matching the provided filter
 * @param filter Filter to match the endpoints against
 * @param enabled New enabled status
 */
const setEndpointEnabled = function (filter: (e: SparqlEndpoint) => boolean, enabled: boolean) {
  const ep = state.endpoints.find(filter);
  if (ep) {
    ep.enabled = enabled;
    save();
  }
}

/**
 * Converts the current list of endpoints into a JSON string for storage and sharing
 * @returns {string} Returns a JSON string representing the currently added Endpoints
 */
const getCurrentConfigString = function () {
  const configArray = [];
  for (const endpoint of state.endpoints) {

    configArray.push({
      "name": endpoint.name,
      "url": endpoint.url,
      "usesOWL": endpoint.supportsOWL,
      "authorization": (endpoint.authorization ? {
        "user": endpoint.authorization.username,
        "password": endpoint.authorization.password
      } : undefined),
      "headers": (endpoint.customHeaders)

    });
  }
  return JSON.stringify(configArray);
}

/**
 * Saves the current configuration in the browsers LocalStorage
 */
const save = function () {
  localStorage.setItem("endpoints", getCurrentConfigString());
}

/**
 * Loads the saved configuration or a fallback default configuration from a URL
 * @param defaultConfigUrl URL of the default configuration
 */
const loadOrDefault = async function (defaultConfigUrl: string): Promise<void> {
  if (localStorage.getItem("endpoints")) {
    const endpoints = parseEndpointConfiguration(<string>localStorage.getItem("endpoints"));
    endpoints.forEach(addEndpoint);
  } else {
    const response = await fetch(defaultConfigUrl);
    const text = await response.text();
    const endpoints = parseEndpointConfiguration(text);
    endpoints.forEach(addEndpoint);
  }
}

export default {
  state: readonly(state),
  addEndpoint,
  editEndpoint,
  removeEndpoint,
  setEndpointEnabled,
  getCurrentConfigString,
  save,
  loadOrDefault
};

export interface SparqlEndpointIF {
  readonly state: { endpoints: SparqlEndpoint[] };

  addEndpoint(endpoint: SparqlEndpoint): void;

  editEndpoint(filter: (e: SparqlEndpoint) => boolean, newEndpoint: SparqlEndpoint): string;

  removeEndpoint(filter: (e: SparqlEndpoint) => boolean): SparqlEndpoint;

  setEndpointEnabled(filter: (e: SparqlEndpoint) => boolean, enabled: boolean): void;

  getCurrentConfigString: () => string;

  save(): void;

  loadOrDefault(defaultConfigUrl: string): Promise<void>
}
