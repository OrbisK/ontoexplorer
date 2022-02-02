import {SparqlObject} from "@/model/SparqlObject";
import {SparqlClass} from "@/model/SparqlClass";
import {reactive, readonly} from "vue";
import SparqlEndpointProvider from "./SparqlEndpointProvider";

const properties: Map<SparqlObject, boolean> = new Map();

const state = reactive({
  properties: properties
});

/**
 * Updates the enabled status of the passed property
 * @param property Property with new enabled status
 * @param enabled New enabled status
 */
const setPropertyEnabled = function (property: SparqlObject, enabled: boolean) {
  if (state.properties.has(property)) {
    state.properties.set(property, enabled);
  }
}

/**
 * Returns the list of properties with true enabled status
 * @returns {SparqlObject[]} array of enabled SparqlObjects
 */
const getEnabledProperties = function () {
  return [...state.properties.entries()].filter((({1: v}) => v === true)).map(([k]) => k);
}

/**
 * Adds a property to the provider
 * @param property New property to add to the provider
 * @returns {string} IRI of the added property
 */
const addProperty = function (property: SparqlObject) {
  state.properties.set(property, false);
  return property.iri;
}

/**
 * Fetches the list of properties based on the passed SparqlClass and
 * the enabled endpoints and adds them to the Provider
 * @param currentClass currently selected SparqlClass
 */
const loadProperties = async function (currentClass: SparqlClass) {
  const properties: SparqlObject[] = [];
  for (const ep of currentClass.getEndpoints()!) {
    if (SparqlEndpointProvider.state.endpoints.find(e => e.url == ep && e.enabled == true)) {
      const epProps = await SparqlEndpointProvider.state.endpoints.find(e => e.url === ep)!.getClassProperties(currentClass.iri);
      for (const p of epProps) {
        if (properties.find(e => e.iri == p.iri) == undefined) {
          properties.push(p);
        }
      }
    }
  }
  for (const prop of properties) {
    addProperty(prop);
  }
}

/**
 * Clears the current map of properties
 */
const clearProvider = function () {
  state.properties.clear();
}

export default {
  state: readonly(state),
  setPropertyEnabled,
  getEnabledProperties,
  addProperty,
  loadProperties,
  clearProvider
};

export interface SparqlPropertyIF {
  readonly state: { properties: Map<SparqlObject, boolean> };

  setPropertyEnabled(property: SparqlObject, enabled: boolean): void;

  getEnabledProperties(): SparqlObject[];

  addProperty(property: SparqlObject): void;

  loadProperties(currentClass: SparqlClass): Promise<void>;

  clearProvider(): void;
}
