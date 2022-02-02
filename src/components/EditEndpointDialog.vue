<template>
  <GenericDialog
      :header_text="header_text"
      max_width="450px"
      @close="onCancel"
  >
    <template v-slot:default>
      <div class="spinner" v-if="waiting">
        <LoadingSpinner/>
      </div>
      <div v-else>
        {{ body_text }}
        <form v-on:submit="onSubmit">
          <div class="formDiv">
            <label>Kurzname:</label>
            <input
                type="text"
                v-model="name"
                name="name"
                placeholder="Name der Wissensbasis">
          </div>
          <div class="formDiv">
            <label>URL*:</label>
            <input
                type="text"
                v-model="url"
                name="url"
                placeholder="URL der Wissensbasis">
          </div>
          <p id="alert" v-if="alertText">{{ alertText }}</p>
          <div class="formDiv"></div>
        </form>
      </div>
    </template>
    <template v-slot:footer>
      {{ footer_text }}
      <button
          type="button"
          v-on:click="onSubmit()"
          id="submitBtn">
        Bestätigen
      </button>
    </template>
  </GenericDialog>
</template>

<script lang="ts" src="./EditEndpointDialog.ts">

</script>

<style lang="scss" scoped>
input {
  @include input;
}

#submitBtn {
  @include button();
  float: right;
}

.material-icons {
  font-size: 16px;
  display: block;
  font-family: 'Material Icons';
  font-weight: normal;
  font-style: normal;
  line-height: 1;
}

.formDiv {
  margin-top: 25px;
}

#alert {
  color: $error-color;
}

.spinner {
  width: 30px;
  height: 30px;
  margin: 40px 0 40px 100px;
}

</style>
