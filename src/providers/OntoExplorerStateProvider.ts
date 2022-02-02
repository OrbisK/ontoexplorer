import {OntoExplorerState, ViewType, toBase64 as stateToBase64} from "@/model/OntoExplorerState";
import {readonly} from "vue";

const state: OntoExplorerState = {
  usedEndpoints: [],
  viewType: ViewType.CLASS,
  currentIri: "",
  classHierarchy: []
};


function updateUsedEndpoints(endpointsUrls: string[]) {
  state.usedEndpoints = endpointsUrls;
}

function updateViewType(vt: ViewType) {
  state.viewType = vt;
}

function updateCurrentIri(iri: string) {
  state.currentIri = iri;
}

function updateClassHierarchy(hierarchy: string[]) {
  state.classHierarchy = hierarchy;
}

function updateAttributes(attributes: string[]) {
  state.attributes = attributes;
}

function resetAttributes() {
  delete state.attributes;
}

function updateFilters(filters: string[]) {
  state.filters = filters;
}

function resetFilters() {
  delete state.filters;
}

function toBase64(): string {
  return stateToBase64(state);
}

export default {
  state: readonly(state), updateUsedEndpoints, updateViewType, updateCurrentIri,
  updateClassHierarchy, updateAttributes, resetAttributes, updateFilters, resetFilters, toBase64
};

export interface OntoExplorerStateIF {
  state: OntoExplorerState;

  updateUsedEndpoints(endpointUrls: string[]): void;

  updateViewType(vt: ViewType): void;

  updateCurrentIri(iri: string): void;

  updateClassHierarchy(hierarchy: string[]): void;

  updateAttributes(attributes: string[]): void;

  resetAttributes(): void;

  updateFilters(filters: string[]): void;

  resetFilters(): void;

  toBase64(): string;
}