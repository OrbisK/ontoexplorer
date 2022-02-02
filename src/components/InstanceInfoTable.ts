import LoadingSpinner from "./LoadingSpinner.vue";
import {Options, Vue} from "vue-class-component";
import {ClassInfoIF} from "@/providers/ClassInfoProvider";
import {SparqlEndpointIF} from "@/providers/SparqlEndpointProvider";
import {OntoExplorerStateIF} from "@/providers/OntoExplorerStateProvider";
import {SparqlObject} from "@/model/SparqlObject";
import {OntoExplorerState, toBase64 as stateToBase64} from "@/model/OntoExplorerState";

@Options({
  props: {
    instance: {
      type: SparqlObject,
      required: true
    }
  },
  components: {
    LoadingSpinner
  },
  emits: ['showInstance'],
  methods: {
    isObject(element: string | SparqlObject): boolean {
      return element instanceof SparqlObject;
    }
  },
  inject: ['sparql', 'classInfo', 'oeState'],
  watch: {
    instance(value: SparqlObject | null) {
      this.loadProperties(value);
    }
  }
})

export default class InstanceInfoTable extends Vue {

  classInfo!: ClassInfoIF;
  sparql!: SparqlEndpointIF;
  oeState!: OntoExplorerStateIF;
  instance!: SparqlObject;
  expandedAttributes: Set<string> = new Set();
  loading: number = 0;

  created(): void {
    this.loadProperties(this.instance).then((listOfAttributes) => {
      listOfAttributes.forEach((object) => {
        this.loadProperties(object).then(() => {
          this.$forceUpdate();
        });
      });
    });
  }

  /**
   * Asynchronous reloading all attributes of a given instances
   * @param instance a SparqlObject to load the attributes from
   * @returns a set of all SparqlObjects that serve as properties of the specified instance
   */
  async loadProperties(instance: SparqlObject): Promise<Set<SparqlObject>> {
    const listOfAttributes = new Set<SparqlObject>();
    this.loading++;
    for (const ep of this.sparql.state.endpoints.filter(e => e.enabled == true)) {
      const epProps = await ep.getInstanceProperties(instance);

      for (const p of epProps) {
        instance.addAttributeOfProperty(p.predicate, p.object);
        if (p.object instanceof SparqlObject) {
          listOfAttributes.add(p.object);
        }
      }

    }
    this.loading--;
    return listOfAttributes;
  }

  showInstance(selectedInstance: SparqlObject): void {
    this.$emit("showInstance", selectedInstance);
  }

  toggleSubtable(predicateIRI: string, attributeIRI: string): void {
    this.toggleSet(this.expandedAttributes, predicateIRI + "," + attributeIRI);
  }

  showSubtable(predicateIRI: string, attributeIRI: string): boolean {
    return this.expandedAttributes.has(predicateIRI + "," + attributeIRI);
  }

  getAttributeStateURL(attributeIRI: string): string {
    const attrState: OntoExplorerState = {...this.oeState.state};
    attrState.currentIri = attributeIRI;
    return window.location.origin + window.location.pathname + "?state=" + stateToBase64(attrState);
  }

  private toggleSet<T>(set: Set<T>, key: T) {
    if (set.has(key)) {
      set.delete(key);
    } else {
      set.add(key);
    }
  }
}
