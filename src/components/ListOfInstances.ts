import {Options, Vue} from "vue-class-component";
import {watch} from "vue";
import LoadingSpinner from "./LoadingSpinner.vue";
import {ClassInfoIF} from "@/providers/ClassInfoProvider";
import {SparqlEndpointIF} from "@/providers/SparqlEndpointProvider";
import {SparqlPropertyIF} from "@/providers/SparqlPropertyProvider";
import {SparqlObject} from "@/model/SparqlObject";
import {SparqlEndpoint} from "@/model/SparqlEndpoint";
import {OntoExplorerStateIF} from "@/providers/OntoExplorerStateProvider";
import {ViewType} from "@/model/OntoExplorerState";

@Options({
  name: 'ListOfInstances',
  components: {
    LoadingSpinner
  },
  inject: ['sparql', 'classInfo', 'property', 'oeState'],
  emits: ['showInstance'],
  computed: {
    selectedProperties(): SparqlObject[] {
      return this.property.getEnabledProperties();
    },
  },
  methods: {
    isObject(element: string | SparqlObject): boolean {
      return element instanceof SparqlObject;
    }
  }
})
export default class ListOfInstances extends Vue {

  maxCount: number = 25;
  instances: SparqlObject[] = [];

  fetching: boolean = false;
  fetchingAttributes: number = 0;
  endOfList: boolean = true;
  listCompleteLoaded: boolean = false;
  currentEndpoint: number = 0;
  page: number = 0;
  offset: number = 0;
  sparql!: SparqlEndpointIF;
  classInfo!: ClassInfoIF;
  property!: SparqlPropertyIF;
  oeState!: OntoExplorerStateIF;
  currentPage: number = 1;
  shownInstances: SparqlObject[] = [];

  created() {
    watch(() => this.classInfo.current.value, this.resetAndReload, {deep: true});
    watch(() => this.sparql.state.endpoints.filter(e => e.enabled), this.resetAndReload, {deep: true})
  }

  /**
   * Reset all values and load one page of instances of the selected class
   */
  async resetAndReload(): Promise<void> {
    this.page = 0;
    this.maxCount = 25;
    this.endOfList = true;
    this.instances = [];
    this.currentEndpoint = 0;
    this.offset = 0;
    this.currentPage = 1;
    this.shownInstances = [];
    this.listCompleteLoaded = false;
    await this.loadNextPage();
    this.pageInstances();
  }

  /**
   * Load the next set of instances into the instances list, but a maximum of maxCount instances
   * Last queried endpoint and offset on that endpoint are reloaded when called multiple times
   */
  async loadNextPage(): Promise<void> {
    if (!this.classInfo.current.value) {
      return;
    }

    this.fetching = true;
    this.page++;

    const endpoints = this.sparql.state.endpoints.filter(
      e =>
        this.classInfo.current.value?.hasEndpoint(e.url) &&
        e.enabled
    );

    const knownInstances = this.instances.length;

    this.endOfList = true;
    for (
      let i = this.currentEndpoint;
      i < endpoints.length && this.instances.length <= this.maxCount * this.page;
      i++
    ) {
      const limit = 1 + this.maxCount * this.page - this.instances.length;
      this.instances.push(...await endpoints[i].getInstancesOf(this.classInfo.current.value.iri, limit, this.offset));
      if ((this.instances.length > this.maxCount * this.page)) {
        this.instances.pop();
        this.currentEndpoint = i;
        this.offset += limit - 1;
        this.endOfList = false;
      } else {
        this.offset = 0;
      }
    }

    this.fetching = false;

    this.dynamicAttributeLoading(endpoints, this.instances.slice(knownInstances));

    this.oeState.updateUsedEndpoints(endpoints.map(e => e.url));
    this.oeState.updateViewType(ViewType.CLASS);
    this.oeState.updateCurrentIri(this.classInfo.current.value?.iri);
    this.oeState.resetAttributes();
    this.oeState.resetFilters();
    this.listCompleteLoaded = this.endOfList;
  }

  /**
   * Asynchronous reloading of all attributes of shown instances
   * @param endpoints All endpoints that should be queried
   */
  async dynamicAttributeLoading(endpoints: Array<SparqlEndpoint>, instances: Array<SparqlObject>) {
    this.fetchingAttributes++;
    for (const instance of instances) {
      for (const ep of endpoints) {
        const epProps = await ep.getInstanceProperties(instance);

        for (const p of epProps) {
          instance.addAttributeOfProperty(p.predicate, p.object);
        }

      }
    }
    this.fetchingAttributes--;
  }

  /**
   * Resets all classlist info-icons to the state before being clicked. Meaning all icon are displayed and the
   * additional classlist row below the element becomes hidden again.
   */
  resetClassListInfo(): void {
    const allcListInfoTD = document.querySelectorAll(".classListInfoIcon");
    allcListInfoTD.forEach(td => {
      const span = td.querySelector("span");
      if (span) {
        span.style.display = "inline";
        span.style.visibility = "visible";
      }
    })
    const allcListInfoTR = document.querySelectorAll(".additional-info");
    allcListInfoTR.forEach(tr => {
      const trElement = tr as HTMLTableRowElement;
      trElement.style.display = "none"
    })
  }

  getRequiredPages() {
    return this.page;
  }

  pageInstances() {
    this.shownInstances = this.instances.slice(
      this.maxCount * (this.currentPage - 1),
      this.maxCount * this.currentPage);

    this.resetClassListInfo();
    if ((this.shownInstances.length != this.maxCount) || ((this.listCompleteLoaded == true) && (Math.ceil(this.instances.length / this.maxCount) == this.currentPage))) {
      this.endOfList = true;
    } else {
      this.endOfList = false;
    }
  }

  /* Emits selected instance.
  */
  onInstanceClick(selectedInstance: SparqlObject): void {
    this.$emit("showInstance", selectedInstance);
  }

  /**
   * Loads the next page if needed
   * shows the loaded page
   */
  async ForwardBtn() {
    while ((this.page * this.maxCount) < this.instances.length) {
      this.page++;
    }
    if ((this.currentPage == this.page) && ((this.page * this.maxCount) <= this.instances.length)) {
      await this.loadNextPage();
    }
    this.currentPage++;
    this.pageInstances();
  }

  /**
   * sets the new MaxCount
   */
  async setMaxCount() {
    const e = (document.getElementById("MaxCountDropDown")) as HTMLSelectElement;
    const opt = e.options[e.selectedIndex];
    await this.configNewMaxCount(parseInt(opt.innerHTML));
  }

  /**
   * Checks the currentPage
   * change it so that the first shown instance is also on the page with a different maxCount
   */
  async configNewMaxCount(newMaxCount: number) {
    if (this.maxCount - newMaxCount > 0) {
      const oldPageLocation = this.currentPage - 1;
      let changePageNumberTo = this.currentPage;
      while (oldPageLocation * this.maxCount >= changePageNumberTo * newMaxCount) {
        changePageNumberTo++;
      }
      this.currentPage = changePageNumberTo;
      this.maxCount = newMaxCount;
      if ((this.page * this.maxCount < this.instances.length) && this.endOfList == false) {
        while ((this.page * this.maxCount < this.instances.length)) {
          await this.loadNextPage();
        }
      }
      if (changePageNumberTo * newMaxCount < this.instances.length) {
        this.endOfList = false;
      }
      this.pageInstances();
    } else {
      let i: number = 1;
      const oldPageLocation = this.currentPage - 1;
      let changePageNumberTo = this.currentPage - 1;
      while (oldPageLocation * this.maxCount < changePageNumberTo * newMaxCount) {
        changePageNumberTo--;
      }
      i = changePageNumberTo + 1;
      this.currentPage = i;
      this.page = this.currentPage;
      this.maxCount = newMaxCount;
      while ((this.page * newMaxCount < this.instances.length) && this.endOfList == false) {
        await this.loadNextPage();
      }
      if ((this.page * newMaxCount > this.instances.length) && this.listCompleteLoaded == false) {
        await this.loadNextPage();
      }
      this.maxCount = newMaxCount;
      this.pageInstances();
    }
  }
}
