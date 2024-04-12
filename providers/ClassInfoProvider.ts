import type { Ref } from '@vue/reactivity'
import { readonly, ref } from '@vue/reactivity'
import type { SparqlClass } from '@/model/SparqlClass'

const classIndex: Map<string, SparqlClass> = new Map()
const current = ref<SparqlClass | null>(null)

/**
 * Removes all classes from index, for example in case of a full reload
 */
function clearIndex() {
  classIndex.clear()
}

/**
 * Inserts new classes, updates class index and returns a canonical class object for every IRI
 * @param cls Old class to merge into the class index
 *        (remains unchanged, should be recycled afterwards)
 * @returns Updated canonical class for the IRI of the old class
 */
function getCanonical(cls: SparqlClass): SparqlClass {
  const canonicalClass = classIndex.get(cls.iri)
  if (canonicalClass) {
    canonicalClass.merge(cls)
    return canonicalClass
  }
  else {
    classIndex.set(cls.iri, cls)
    return cls
  }
}

/**
 * Set currently selected class
 * @param classIri Selected class or null value to reset selection
 */
function setCurrent(classIri: string | null) {
  current.value = classIri ? classIndex.get(classIri) || null : null
}

export default { current: readonly(current), setCurrent, getCanonical, clearIndex }

export interface ClassInfoIF {
  readonly current: Ref<SparqlClass | null>

  setCurrent: (classIri: string | null) => void

  getCanonical: (cls: SparqlClass) => SparqlClass

  clearIndex: () => void
}
