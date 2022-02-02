import {Options, Vue} from "vue-class-component";
import GenericDialog from "./GenericDialog.vue";

@Options({
  props: {
    stateJson: {
      type: String,
      default: '{"error": "something went wrong in this vue component"}'
    },
    shareUrl: {
      type: String,
      default: ""
    }
  },
  components: {
    GenericDialog
  }
})
export default class ShareStateDialog extends Vue {
  close(): void {
    this.$emit("close");
  }
}
