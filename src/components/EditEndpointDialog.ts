import {Options, Vue} from "vue-class-component";
import {SparqlEndpoint} from "@/model/SparqlEndpoint";
import sparql from "@/providers/SparqlEndpointProvider";
import LoadingSpinner from "./LoadingSpinner.vue";
import GenericDialog from "./GenericDialog.vue";

@Options({
  props: {
    header_text: {
      type: String,
      default: "This is the Dialog Header"
    },
    body_text: {
      type: String,
      default: "This is the Dialog Body"
    },
    footer_text: {
      type: String,
      default: "This is the Dialog Footer"
    },
    currentEndpoint: {
      type: SparqlEndpoint
    }
  },
  inject: ['sparql'],
  watch: {
    url(value) {
      this.validateUrl(value);
    }
  },
  created: function () {
    this.url = this.currentEndpoint.url;
    this.name = this.currentEndpoint.name;
  },
  components: {
    LoadingSpinner, GenericDialog
  }
})

export default class EditEndpointDialog extends Vue {
  alertText: string = "";
  name: string = "";
  url: string = "";
  waiting = false;
  currentEndpoint!: SparqlEndpoint;

  onCancel(): void {
    this.$emit("canceled", true);
  }

  /**
   * Accures when the submit button is clicked. Shows red alert text if no URL is specified.
   * If no new name is specified the current name remains.
   * Shows alert if specified unique name or endpoint URL is already used. Checks if specified endpoint URL leads
   * to a real SPARQL endpoint. Emits True if URL leads to a real enpoint, False if not.
   * @emit ("submitted", boolean)
   */
  onSubmit(): void {
    if (!this.url) {
      this.alertText = "Es muss mindestens eine URL angegeben werden!";
      return;
    }

    if (!(this as any).validateUrl(this.url)) {
      return;
    }

    if (!this.name) {
      this.name = this.currentEndpoint.name;
    }

    if (sparql.state.endpoints.find(e => e.name === this.name && e.name !== this.currentEndpoint.name)) {
      this.alertText = "Dieser Name ist bereits vergeben!";
      return;
    }

    const ename = sparql.state.endpoints.find(e => e.url === this.url && e.url !== this.currentEndpoint.url)?.name;
    if (ename) {
      this.alertText = `Ein Endpunkt mit dieser URL ist schon Teil der Liste! Du findest ihn unter dem Namen "${ename}".`;
      return;
    }

    if (this.url == this.currentEndpoint.url) {
      if (this.name != this.currentEndpoint.name) {
        const newEndpoint = new SparqlEndpoint(this.name, false, this.url);
        sparql.editEndpoint(e => e.name === this.currentEndpoint.name, newEndpoint);
      }
      this.$emit("submitted", true);
      return;
    }

    this.waiting = true;
    const newEndpoint = new SparqlEndpoint(this.name, false, this.url);
    newEndpoint.doChecks().then(isWorking => {
      if (isWorking) {
        sparql.editEndpoint(e => e.name === this.currentEndpoint.name, newEndpoint);
      } else {
        this.alertText = "Die angegebene URL konnte nicht erreicht werden.";
      }
      this.waiting = false;
      this.$emit("submitted", isWorking);
    }).catch(err => {
      this.waiting = false;
      this.alertText = "Error: " + JSON.stringify(err);
    });
  }

  /**
   * Validates an URL input to check for common errors (wrong protocol, missing path, etc.)
   * Excludes IDNs and other non-URI-characters, must be ASCII-coded to be used.
   * No question marks or hash signs in the path are allowed, as '?' marks the beginning of a query.
   * The rest is inaccurate (i.e. IPv6 validation), but should at least exclude common mistakes.
   * @param url The URL to check
   * @return A boolean value that is true if the URL passes the test
   */
  validateUrl(url: string): boolean {
    const re = new RegExp(
      "^https?:\\/\\/"
      + "(?:[a-zA-Z0-9\\-._~!$&'()*+,;=:%]+@)?(?:[a-zA-Z\\-\\.]+|(?:\\[[a-fA-F0-9:]+\\])|(?:\\d{1,2}|1\\d{2}|2[0-4]\\d|25[0-5])(?:\\.(?:\\d{1,2}|1\\d{2}|2[0-4]\\d|25[0-5])){3})(?::\\d+)?\\/"
      + "[a-zA-Z0-9\\-._~:/\\[\\]@!$&'()*+,;=%]*$");

    if (!re.test(url)) {
      this.alertText = "Die eingegebene URL wird nicht akzeptiert!";
      return false;
    } else {
      this.alertText = "";
      return true;
    }
  }
}
