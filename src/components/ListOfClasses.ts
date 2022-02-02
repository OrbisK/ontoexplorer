import {Options, Vue} from "vue-class-component";
import {watch} from "vue";
import ExpandableClass from './ExpandableClass.vue';
import LoadingSpinner from "./LoadingSpinner.vue";
import {SparqlClass} from '@/model/SparqlClass';
import {ClassInfoIF} from "@/providers/ClassInfoProvider";
import {SparqlEndpointIF} from "@/providers/SparqlEndpointProvider";
import {OntoExplorerStateIF} from "@/providers/OntoExplorerStateProvider";

@Options({
  name: 'ListOfClasses',
  components: {
    ExpandableClass, LoadingSpinner
  },
  inject: ['sparql', 'classInfo', 'oeState'],
  watch: {
    selectedClass(value: string | null) {
      this.classInfo.setCurrent(value);
    }
  }
})

export default class ListOfClasses extends Vue {
  waiting = false;
  classes: SparqlClass[] = [];
  selectedClass: string | null = null;
  sparql!: SparqlEndpointIF;
  classInfo!: ClassInfoIF;
  oeState!: OntoExplorerStateIF;

  classHierarchy: string[] = [];
  startedFetch: number = 0;

  /**
   * Starts fetching all classes of selected endpoints during creation and changes in the endpoint list
   */
  created() {
    if (this.sparql.state.endpoints.filter(e => e.enabled).length > 0) {
      this.fetchAllClasses();
    }
    watch(() => this.sparql.state.endpoints.filter(e => e.enabled), async (endpoints, prevEndpoints) => {
      await this.fetchAllClasses();
    }, {deep: true});
  }

  /**
   * Searches for root classes on all selected endpoints and combines them in a list for display
   */
  async fetchAllClasses(): Promise<void> {
    this.selectedClass = null;
    this.waiting = true;
    const started = Date.now();
    this.startedFetch = started;

    try {
      for (const endpoint of this.sparql.state.endpoints.filter(e => e.enabled)) {
        if (this.startedFetch !== started) {
          return;
        }
        if (!await endpoint.doChecks()) {
          this.$toast.warning(`${endpoint.name} konnte nicht erreicht werden!`);
        }
      }

      let allClasses: Set<SparqlClass> = new Set();
      for (const endpoint of this.sparql.state.endpoints.filter(e => e.enabled)) {
        if (this.startedFetch !== started) {
          return;
        }
        const cls = await endpoint.getClasses();
        allClasses = new Set([...allClasses, ...cls]);
      }

      if (this.startedFetch !== started) {
        return;
      }
      this.classes = [...allClasses].sort((a, b) => a.compare(b));
    } catch (error) {
      this.classes = [];
      this.$toast.error(`Fehler beim Abrufen der Root-Klassen!`);
      console.error(error);
    }
    this.waiting = false;
    this.$emit("finish-load");
  }

  passHierarchyUpdate(hierarchy: string[]) {
    this.classHierarchy = hierarchy;
    this.oeState.updateClassHierarchy(hierarchy);
  }

  onLOCClick(): void {
    this.$emit("classClicked");
  }
}
