import {Options, Vue} from "vue-class-component";
import {SparqlEndpointIF} from "@/providers/SparqlEndpointProvider";
import {SparqlEndpoint} from "@/model/SparqlEndpoint";
import GenericDialog from "./GenericDialog.vue";
import LoadingSpinner from "./LoadingSpinner.vue";

@Options({
  inject: ['sparql'],
  components: {
    GenericDialog, LoadingSpinner
  },
  computed: {
    error(): boolean {
      return this.warning && this.notReachableEPs.length > 0;
    },
    buttons(): String[] {
      if (this.waiting) {
        return [];
      } else if (this.showInfo) {
        return ["Mit Import fortfahren", "Abbrechen"];
      } else {
        return ["Importieren", "Formatieren"];
      }
    }
  },
  methods: {
    handleButtonClick(btn: Number): void {
      if (this.showInfo) {
        switch (btn) {
          case 0:
            this.importEndpoints();
            break;
          case 1:
            this.backToTextArea();
        }
      } else {
        switch (btn) {
          case 0:
            this.checkImportString();
            break;
          case 1:
            this.formatImportString();
        }
      }
    }
  }
})

export default class ImportEndpointsDialog extends Vue {

  sparql!: SparqlEndpointIF;
  importString: string = "";
  endpoints: [SparqlEndpoint, boolean, string][] = [];
  notReachableEPs: [SparqlEndpoint, boolean, string][] = [];
  alrExistingEPs: [SparqlEndpoint, boolean, string][] = [];
  waiting: boolean = false;
  warning: boolean = false;
  showInfo: boolean = false;
  alertText: string = "";
  warningText: string = "";

  close() {
    this.$emit("close");
  }

  backToTextArea() {
    this.warning = false;
    this.showInfo = false;
    this.alertText = "";
    this.endpoints = [];
    this.notReachableEPs = [];
    this.alrExistingEPs = [];
  }

  formatImportString() {
    if (this.validateImportString())
      this.importString = JSON.stringify(JSON.parse(this.importString), null, 2);
  }

  checkImportString() {
    this.alertText = "";

    if (!this.validateImportString()) {
      return;
    }

    const importArray = JSON.parse(this.importString)

    if (!Array.isArray(importArray)) {
      this.alertText = "Fehler: Der eingegebene Import String entspricht nicht dem richtigen Format."
      return;
    }

    if (importArray.length === 0) {
      this.alertText = "Fehler: Der Import String muss mindestens einen Endpunkt enthalten."
      return;
    }

    if (!this.validateParsedImportArray(importArray)) {
      return;
    }

    this.waiting = true;
    this.checkNewEndpoints(importArray).then(() => {
      this.waiting = false;
      this.showInfo = true;
      this.notReachableEPs = this.endpoints.filter(ep => ep[1] === true && ep[2].length != 0);
      this.alrExistingEPs = this.endpoints.filter(ep => ep[1] === false);
      this.alertText = `${this.endpoints.length - this.notReachableEPs.length} von ${this.endpoints.length} Endpunkten können importiert werden. 
      (${this.notReachableEPs.length} Fehler, ${this.alrExistingEPs.length} Warnungen)`;
      this.warningText = `Bei Import würden ${this.alrExistingEPs.length} schon existierende Endpunkte überschrieben werden.`;
      this.warning = this.alrExistingEPs.length > 0 || this.notReachableEPs.length > 0
    })
  }

  validateImportString() {
    try {
      JSON.parse(this.importString);
      return true;
    } catch (error) {
      this.alertText = "Fehler: Der eingegebene Import String entspricht nicht dem richtigen Format."
      return false;
    }
  }

  validateParsedImportArray(importArray: any[]) {
    const validate = require('jsonschema').validate;
    const endpointSchema = {
      "type": "object",
      "properties": {
        "name": {"type": "string"},
        "url": {"type": "string", "format": "uri"}
      },
      "required": ["name", "url"]
    };
    for (const obj of importArray) {
      if (!validate(obj, endpointSchema).valid) {
        this.alertText = "Fehler: Die Endpunktdaten entsprechen nicht dem gültigen JSON-Format für Endpunkte.";
        return false;
      }
    }
    for (let i = 0; i < importArray.length; i++) {
      for (let j = i + 1; j < importArray.length; j++) {
        if (importArray[i].name == importArray[j].name || importArray[i].url == importArray[j].url) {
          this.alertText = "Fehler: Der Import enthält doppelt vergebene Endpunktnamen oder URLs."
          return false;
        }
      }
    }
    return true;
  }

  async checkNewEndpoints(importArray: any) {
    for (const element of importArray) {
      const newEndpoint = new SparqlEndpoint(element.name, false, element.url);
      let newLength: number;

      try {
        const isWorking = await newEndpoint.doChecks();
        if (isWorking)
          newLength = this.endpoints.push([newEndpoint, true, ""]);
        else
          newLength = this.endpoints.push([newEndpoint, true, "Checks failed. No Valid Enpoint URL."]);
      } catch (error) {
        newLength = this.endpoints.push([newEndpoint, true, "Error: " + JSON.stringify(error)]);
      }

      if (this.endpoints[newLength - 1][2] === "") {
        const ename = this.sparql.state.endpoints.find(e => e.url === element.url || e.name === element.name)?.name;
        if (ename) {
          this.endpoints[newLength - 1][1] = false;
          this.endpoints[newLength - 1][2] = ename;
        }
      }

    }
  }

  importEndpoints() {
    if (this.notReachableEPs.length == 0 && this.alrExistingEPs.length == 0) {
      for (const ep of this.endpoints) {
        if (!ep[1])
          this.sparql.editEndpoint(e => e.name === ep[2], ep[0])
        else if (ep[2].length == 0)
          this.sparql.addEndpoint(ep[0])
      }
      this.$toast.success('Import erfolgreich!');
      this.$emit("close");
    } else {
      this.alertText = `Achtung, wollen Sie wirklich mit dem Import fortfahren?
      Es werden ${this.endpoints.length - this.notReachableEPs.length} von ${this.endpoints.length} Endpunkten hinzugefügt 
      und dabei  ${this.alrExistingEPs.length} schon existierende Endpunkte überschrieben.`;
      this.notReachableEPs = [];
      this.alrExistingEPs = [];
    }
  }

}
