import { getCheckOWLQuery } from './queries/CheckOWLQuery'
import {
  getAllClassesQuery,
  getClassPropertiesQuery,
  getClassesOfQuery,
  getOWLRootClassesQuery,
  getSubclassesQuery,
} from '@/model/queries/ClassesQueries'
import { getCompatibilityInstancesOfQuery, getInstancesOfQuery } from '@/model/queries/InstancesQueries'
import { getInstancePropertiesQuery } from '@/model/queries/InstancePropertyQueries'

export default {
  getCheckOWLQuery,
  getAllClassesQuery,
  getOWLRootClassesQuery,
  getSubclassesQuery,
  getClassPropertiesQuery,
  getInstancesOfQuery,
  getCompatibilityInstancesOfQuery,
  getInstancePropertiesQuery,
  getClassesOfQuery,
}
