/**
 * Current view type for the main container
 */
export enum ViewType {
  CLASS, /** List of instances for this class */
  INSTANCE/** List of properties for this instance */
}

/**
 * Current view state of the OntoExplorer that can be shared and loaded
 */
export interface OntoExplorerState {

  usedEndpoints: string[],
  viewType: ViewType,
  currentIri: string,
  classHierarchy: string[],

  attributes?: string[],
  filters?: string[]

}

function b64EncodeUnicode(str: string): string {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
    return String.fromCharCode(parseInt(p1, 16));
  }))
}

function b64DecodeUnicode(str: string): string {
  return decodeURIComponent(Array.prototype.map.call(atob(str), function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''))
}

export function fromBase64(base: string): OntoExplorerState {
  const decoded = b64DecodeUnicode(base);
  return JSON.parse(decoded);
}

export function toBase64(state: OntoExplorerState): string {
  return b64EncodeUnicode(JSON.stringify(state));
}
