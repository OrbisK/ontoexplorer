import {ClassInfoIF} from "@/providers/ClassInfoProvider";
import LoadingSpinner from "./LoadingSpinner.vue";
import {watch} from "vue";
import {Options, Vue} from "vue-class-component";
import {SparqlPropertyIF} from "@/providers/SparqlPropertyProvider";

@Options({
  components: {
    LoadingSpinner
  },
  inject: ['classInfo', 'property']
})
export default class ListOfProperties extends Vue {
  waiting: boolean = false;
  classInfo!: ClassInfoIF;
  property!: SparqlPropertyIF;

  created(): void {
    watch(() => this.classInfo.current.value, this.updateProperties, {deep: true});
  }

  /**
   * Updates the List of Properties by clearing and updating the SparqlPropertyProvider
   */
  async updateProperties(): Promise<void> {
    this.waiting = true;
    this.property.clearProvider();
    if (this.classInfo.current.value)
      await this.property.loadProperties(this.classInfo.current.value);
    this.waiting = false;
    this.$emit("finish-load");
  }

}