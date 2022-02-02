import {watch} from "vue";
import ListOfEndpoints from './ListOfEndpoints.vue';
import ListOfClasses from './ListOfClasses.vue';
import ListOfProperties from './ListOfProperties.vue';
import ListOfInstances from './ListOfInstances.vue';
import AddEndpointDialog from './AddEndpointDialog.vue';
import InstanceInfoTable from './InstanceInfoTable.vue';
import EditEndpointDialog from './EditEndpointDialog.vue';
import HelpDialog from './HelpDialog.vue';
import GenericDialog from './GenericDialog.vue';
import {Options, Vue} from "vue-class-component";
import {SparqlEndpoint} from "@/model/SparqlEndpoint";
import {SparqlObject} from "@/model/SparqlObject";
import appVersion from "../../version";
import Tooltip from "@/components/Tooltip.vue";
import {ClassInfoIF} from "@/providers/ClassInfoProvider";
import * as OntoExplorerState from "@/model/OntoExplorerState";
import {ViewType} from "@/model/OntoExplorerState";
import {OntoExplorerStateIF} from "@/providers/OntoExplorerStateProvider";
import {SparqlPropertyIF} from "@/providers/SparqlPropertyProvider";
import ShareStateDialog from "@/components/ShareStateDialog.vue";
import {SparqlEndpointIF} from "@/providers/SparqlEndpointProvider";
import ExportEndpointsDialog from "@/components/ExportEndpointsDialog.vue";
import ImportEndpointsDialog from "@/components/ImportEndpointsDialog.vue";

@Options({
  components: {
    ShareStateDialog, Tooltip, ListOfClasses, ListOfEndpoints, ListOfInstances,
    ListOfProperties, AddEndpointDialog, EditEndpointDialog, InstanceInfoTable,
    GenericDialog, HelpDialog, ExportEndpointsDialog, ImportEndpointsDialog
  },
  inject: ['sparql', 'classInfo', 'oeState', 'property']
})

export default class MainPage extends Vue {

  AddEndpointDialogshown: boolean = false;
  ListOfInstancesshown: boolean = true;
  InstanceInfoTableshown: boolean = false;
  HelpShown: boolean = false;
  removingEndpoint: SparqlEndpoint | null = null;
  editingEndpoint: SparqlEndpoint | null = null;
  isSharingUrl: boolean = false;
  exportEndpointsDialogShown: boolean = false;
  importEndpointsDialogShown: boolean = false;
  showDropdown: boolean = false;
  addMissingEndpointsDialogShown: boolean = false;


  sparql!: SparqlEndpointIF;
  classInfo!: ClassInfoIF;
  oeState!: OntoExplorerStateIF;
  property!: SparqlPropertyIF;


  resultbox_caption: string = "Liste der Elemente";
  versionShort: string = appVersion.substring(1).split('-')[0];
  versionLong: string = appVersion;

  shareJsonData: string = "";
  shareUrl: string = "";
  selectedInstance: SparqlObject | null = null;
  decodedState: OntoExplorerState.OntoExplorerState | null = null;
  stateToRestore: OntoExplorerState.OntoExplorerState | null = null;

  created() {
    history.replaceState({selectedInstance: null}, "");
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("state")) {
      try {
        this.decodedState = OntoExplorerState.fromBase64(urlParams.get("state")!);
        const missingEndpoints = this.decodedState.usedEndpoints
          .filter(url => !this.sparql.state.endpoints.find(ep => ep.url === url));

        if (missingEndpoints.length > 0)
          this.addMissingEndpointsDialogShown = true;
        else
          this.restoreState();
      } catch (e) {
        this.$toast.error('Could not load state from URL!');
      }
    }
    watch(() => this.classInfo.current.value, () => {
      this.updateResultboxCaption();
      this.updateURL();
    }, {deep: true});
    watch(() => this.property.state.properties, () => {
      const enabledProps = this.property.getEnabledProperties().map(prop => prop.iri);
      if (enabledProps.length > 0) {
        this.oeState.updateAttributes(enabledProps);
      } else {
        this.oeState.resetAttributes();
      }
      history.replaceState({selectedInstance: this.selectedInstance?.iri}, "", "?state=" + this.oeState.toBase64());

    }, {deep: true});

    window.addEventListener("popstate", (event => {
      if (event.state.selectedInstance)
        this.showInstanceInfoTable(new SparqlObject(event.state.selectedInstance), true);
      else
        this.returnToClassesFromInstance();
    }));
  }

  showAddEndpointDialog(): void {
    this.AddEndpointDialogshown = true;
  }

  hideAddEndpointDialog(): void {
    this.AddEndpointDialogshown = false;
  }

  testDialogData(newEndpointAdded: boolean): void {
    if (newEndpointAdded) {
      this.hideAddEndpointDialog();
    }
  }


  showRemoveEndpointDialog(endpoint: SparqlEndpoint): void {
    this.removingEndpoint = endpoint;
  }

  hideRemoveEndpointDialog(): void {
    this.removingEndpoint = null;
  }

  RemoveEndpoint(): void {
    if (this.removingEndpoint != null) {
      if (null == this.sparql.removeEndpoint(e => e.url === this.removingEndpoint?.url)) {
        this.$toast.error("Endpunkt konnte nicht entfernt werden!");
      }
    }
  }

  showEditEndpointDialog(endpoint: SparqlEndpoint): void {
    this.editingEndpoint = endpoint;
  }


  hideEditEndpointDialog(endpointEdited: boolean): void {
    if (endpointEdited) {
      this.editingEndpoint = null;
    }
  }

  hideExportEndpointsDialog(): void {
    this.exportEndpointsDialogShown = false;
  }

  showExportEndpointsDialog(): void {
    this.exportEndpointsDialogShown = true;
  }

  hideImportEndpointsDialog(): void {
    this.importEndpointsDialogShown = false;
  }

  showImportEndpointsDialog(): void {
    this.importEndpointsDialogShown = true;
  }

  hideAddMissingEndpointsDialog() {
    this.addMissingEndpointsDialogShown = false;
    this.restoreState();
  }

  addMissingEndpoints() {
    const missingEndpoints = this.decodedState!.usedEndpoints
      .filter(url => !this.sparql.state.endpoints.find(ep => ep.url === url));
    missingEndpoints.forEach(ep => {
      this.sparql.addEndpoint(new SparqlEndpoint(ep, false, ep));
    });
  }

  returnToClassesFromInstance(): void {
    this.oeState.updateViewType(ViewType.CLASS);
    this.oeState.updateCurrentIri(this.classInfo.current.value?.iri!);
    this.selectedInstance = null;
    this.updateURL();
    this.updateResultboxCaption();
  }

  showInstanceInfoTable(instance: SparqlObject, backwards?: Boolean): void {
    this.oeState.updateViewType(ViewType.INSTANCE);
    this.oeState.updateCurrentIri(instance.iri);
    this.resultbox_caption = "Eigenschaften von '" + instance.label + "'";
    this.selectedInstance = instance;
    if (!backwards)
      history.pushState({selectedInstance: this.selectedInstance?.iri}, "", "?state=" + this.oeState.toBase64());
    this.ListOfInstancesshown = false;
    this.InstanceInfoTableshown = true;
  }

  updateResultboxCaption(): void {
    if (this.selectedInstance)
      this.returnToClassesFromInstance();
    else {
      let selectedClass: string = "";
      if (this.classInfo.current.value != null) {
        if (this.classInfo.current.value.label == null)
          selectedClass = this.classInfo.current.value.iri;
        else
          selectedClass = this.classInfo.current.value.label;
        this.resultbox_caption = "Liste der Klasse '" + selectedClass + "'";
      } else
        this.resultbox_caption = "Liste der Elemente"
    }
  }

  shareStateUrl() {
    this.shareJsonData = JSON.stringify(this.oeState.state);
    this.shareUrl = window.location.origin + window.location.pathname + "?state=" + this.oeState.toBase64();
    this.isSharingUrl = true;
  }

  hideShareStateDialog() {
    this.isSharingUrl = false;
  }

  restoreState() {
    this.oeState.updateUsedEndpoints(this.decodedState!.usedEndpoints);
    this.oeState.updateClassHierarchy(this.decodedState!.classHierarchy);
    this.oeState.updateCurrentIri(this.decodedState!.currentIri);
    this.sparql.state.endpoints.forEach(ep => this.sparql.setEndpointEnabled(ep2 => ep.url === ep2.url, false));
    this.decodedState!.usedEndpoints.forEach(url => this.sparql.setEndpointEnabled(ep => url === ep.url, true));
    this.stateToRestore = this.decodedState!;
    this.decodedState = null;
  }

  continueRestoreState() {
    if (this.stateToRestore) {
      if (this.stateToRestore.viewType === ViewType.INSTANCE) {
        this.showInstanceInfoTable(new SparqlObject(this.stateToRestore.currentIri));
        history.replaceState({selectedInstance: this.stateToRestore.currentIri}, "");
      }
      if (this.stateToRestore.attributes) {

        for (const so of this.property.state.properties.keys()) {
          if (this.stateToRestore.attributes?.includes(so.iri)) {
            this.property.setPropertyEnabled(so, true);
          }
        }

      }
      this.stateToRestore = null;

    }

  }

  showHelp(): void {
    this.HelpShown = true;
  }

  hideHelp(): void {
    this.HelpShown = false;
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  BackButtonClick(): void {
    history.back();
  }

  updateURL(): void {
    history.replaceState({selectedInstance: null}, "", "?state=" + this.oeState.toBase64());
  }
}
