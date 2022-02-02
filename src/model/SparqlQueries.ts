import {getCheckOWLQuery} from '@/model/queries/CheckOWLQuery';
import {
  getAllClassesQuery,
  getClassPropertiesQuery,
  getOWLRootClassesQuery,
  getSubclassesQuery,
  getClassesOfQuery
} from "@/model/queries/ClassesQueries";
import {getInstancesOfQuery, getCompatibilityInstancesOfQuery} from "@/model/queries/InstancesQueries"
import {getInstancePropertiesQuery} from "@/model/queries/InstancePropertyQueries";

export default {
  getCheckOWLQuery,
  getAllClassesQuery, getOWLRootClassesQuery, getSubclassesQuery, getClassPropertiesQuery,
  getInstancesOfQuery, getCompatibilityInstancesOfQuery,
  getInstancePropertiesQuery, getClassesOfQuery
};
