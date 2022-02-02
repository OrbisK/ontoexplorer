import {Options, Vue} from "vue-class-component";

@Options({
  name: 'GenericDialog',
  props: {
    header_text: {
      type: String,
      default: ''
    },
    modal: {
      type: Boolean,
      default: false
    },
    max_width: {
      type: String,
      default: '600px'
    },
    max_height: {
      type: String
    },
    buttons_style: {
      type: String,
    },
    buttons: {
      type: Array,
      default: [],
    }
  },
  emits: ['clicked', 'close'],
  computed: {
    hasFooter() {
      return this.buttons.length >= 1 || this.$slots['footer'];
    }
  },
})

export default class ExportEndpointsDialog extends Vue {
  modal!: boolean;

  close() {
    if (!this.modal) {
      this.$emit("close");
    }
  }

  clicked(button: Number) {
    this.$emit("clicked", button);
  }

}
