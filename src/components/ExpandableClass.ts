import {Options, Vue} from "vue-class-component";
import Tooltip from "@/components/Tooltip.vue";
import LoadingSpinner from "./LoadingSpinner.vue";
import {SparqlClass} from "@/model/SparqlClass";
import {ClassInfoIF} from "@/providers/ClassInfoProvider";
import {SparqlEndpointIF} from "@/providers/SparqlEndpointProvider";
import {OntoExplorerStateIF} from "@/providers/OntoExplorerStateProvider";

@Options({
  name: "ExpandableClass",
  components: {Tooltip, LoadingSpinner},
  inject: ["sparql", 'classInfo', 'oeState'],
  props: {
    classData: SparqlClass,
    modelValue: String,
    depth: Number
  },
  emits: ['update:modelValue', 'hierarchyUpdate'],
  watch: {
    modelValue(value: string) {
      if (this.subclass) {
        this.subclass = value;
      }
    },
    subclass(value: string | null) {
      this.$emit("update:modelValue", value);
      this.classInfo.setCurrent(value);
    }
  },
  computed: {
    isSelected() {
      return this.modelValue === this.classData.iri;
    }
  }
})

export default class ExtendableClass extends Vue {
  unfolded: boolean = false;
  fetching: boolean = false;
  subclass: string | null = null;
  subclasses: SparqlClass[] = [];
  subclassesLoaded: boolean = false;
  classData!: SparqlClass;
  modelValue!: String;
  sparql!: SparqlEndpointIF;
  classInfo!: ClassInfoIF;
  oeState!: OntoExplorerStateIF;
  depth: number = 0;


  created() {
    if (this.oeState.state.classHierarchy[this.depth] === this.classData.iri) {
      this.unfolded = true;
      this.fetchSubclasses();
    }
    if (this.oeState.state.currentIri === this.classData.iri
      || this.oeState.state.classHierarchy[this.oeState.state.classHierarchy.length - 1] === this.classData.iri) {
      this.updateSelected(this.classData.iri);
    }
  }

  toggleUnfold() {
    if (!this.classData.hasSubclasses) {
      this.$toast.default(
        `Die Klasse "${this.classData.label}" besitzt keine Subklassen auf den ausgewählten Endpunkten`,
      );
      return;
    }
    this.unfolded = !this.unfolded;
    if (this.unfolded && !this.subclassesLoaded && !this.fetching) {
      this.fetchSubclasses();
    }
  }

  /**
   * Updates the selected class that determines the behavior of the hierarchical list
   */
  updateSelected(value: String) {
    if (!this.subclassesLoaded && !this.fetching) {
      this.fetchSubclasses();
    }
    this.$emit("update:modelValue", this.modelValue == value ? "" : value);
    this.$emit("hierarchyUpdate", [value]);
  }

  passHierarchyUpdate(hierarchy: string[]) {
    hierarchy.unshift(this.classData.iri);
    this.$emit("hierarchyUpdate", hierarchy);
  }

  /**
   * Fetches all subclasses of this class from all endpoints
   */
  async fetchSubclasses(): Promise<void> {
    this.fetching = true;
    this.subclasses.length = 0;
    try {
      let loadedClasses: Set<SparqlClass> = new Set();
      for (const endpoint of this.sparql.state.endpoints.filter(e => e.enabled)) {
        const cls = await endpoint.getSubclasses(this.classData.iri);
        loadedClasses = new Set([...loadedClasses, ...cls]);
      }
      this.subclasses = [...loadedClasses].sort((a, b) => a.compare(b));
      this.subclassesLoaded = true;
    } catch (e) {
      this.subclasses.length = 0;
      console.error("Problem fetching subclasses: ", e);
    }
    if (this.subclasses.length == 0) {
      this.unfolded = false;
    }
    this.fetching = false;
  }
}
