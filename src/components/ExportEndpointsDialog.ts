import {Options, Vue} from "vue-class-component";
import GenericDialog from "./GenericDialog.vue";
import {SparqlEndpointIF} from "@/providers/SparqlEndpointProvider";
import {SparqlEndpoint} from "@/model/SparqlEndpoint";

@Options({
  inject: ['sparql'],
  created() {
    this.endpoints = this.sparql.state.endpoints.map((ep: SparqlEndpoint) => [ep, true]);
  },
  computed: {
    exportString: function () {
      return JSON.stringify(this.getExportObject(), null, 2);
    }
  },
  components: {
    GenericDialog
  }
})

export default class ExportEndpointsDialog extends Vue {

  sparql!: SparqlEndpointIF;
  endpoints: [SparqlEndpoint, boolean][] = [];

  close() {
    this.$emit("close");
  }

  toggleChecked(index: number) {
    this.endpoints[index][1] = !this.endpoints[index][1];
  }

  getExportObject() {
    const configArray = [];
    for (const endpoint of this.endpoints.filter((ep: [SparqlEndpoint, boolean]) => ep[1])) {
      configArray.push({
        "name": endpoint[0].name,
        "url": endpoint[0].url,
        "authorization": (endpoint[0].authorization ? {
          "user": endpoint[0].authorization.username,
          "password": endpoint[0].authorization.password
        } : undefined),
        "headers": (endpoint[0].customHeaders.size > 0 ? endpoint[0].customHeaders : undefined)
      });
    }
    return configArray;
  }

  copyExportString() {
    if (window.isSecureContext && navigator.clipboard) {
      navigator.clipboard.writeText(JSON.stringify(this.getExportObject())).then(() => {
        this.$toast.success('Config copied to clipboard!');
      });
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = JSON.stringify(this.getExportObject());
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      if (document.execCommand('copy')) {
        this.$toast.success('Config copied to clipboard!');
      } else {
        this.$toast.error('Error accessing clipboard!');
      }
      textArea.remove();
    }
  }
}
