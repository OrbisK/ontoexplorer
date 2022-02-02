<template>
  <GenericDialog
      header_text="Ansicht teilen"
      @close="close"
      max_width="800px"
  >
    <p><b>Die folgende Ansicht wird geteilt:</b></p>
    <textarea readonly v-model="stateJson" rows="4"></textarea><br><br>
    <p><b>Url:</b></p>
    <textarea readonly v-model="shareUrl" rows="4"></textarea>
  </GenericDialog>
</template>

<script lang="ts" src="./ShareStateDialog.ts">

</script>

<style lang="scss" scoped>

textarea {
  @include input;
  resize: none;
  border-radius: 0pt;
}


</style>
