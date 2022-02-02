import {Options, Vue} from "vue-class-component";
import GenericDialog from "./GenericDialog.vue";

@Options({
  name: 'HelpDialog',
  components: {
    GenericDialog
  }
})

export default class customdialogtemplate extends Vue {
  onCancel(): void {
    this.$emit("cancel");
  }
}
