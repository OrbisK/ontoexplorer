import {Options, Vue} from "vue-class-component";
import {SparqlEndpoint} from "@/model/SparqlEndpoint";
import {SparqlEndpointIF} from "@/providers/SparqlEndpointProvider";
import {ClassInfoIF} from "@/providers/ClassInfoProvider";

@Options({
  components: {},
  inject: ['sparql', 'classInfo'],
  emits: ['remove', 'edit', 'enabledEndpointsChanged'],
})
export default class ListOfEndpoints extends Vue {
  sparql!: SparqlEndpointIF;
  classInfo!: ClassInfoIF;

  onRemove(endpoint: SparqlEndpoint): void {
    this.$emit("remove", endpoint);
  }

  onEdit(endpoint: SparqlEndpoint): void {
    this.$emit("edit", endpoint);
  }

  onEnabledEndpointsChanged(endpoint: SparqlEndpoint): void {
    this.classInfo.clearIndex();
    this.sparql.setEndpointEnabled(e => e.name === endpoint.name, !endpoint.enabled);
    this.$emit("enabledEndpointsChanged");
  }
}
