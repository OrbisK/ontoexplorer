<template>
  <GenericDialog
      header_text="Endpunkte importieren"
      @close="close"
      max_width="800px"
      :buttons=buttons
      @clicked="handleButtonClick"
  >
    <div class="spinner" v-if="waiting">
      <LoadingSpinner/>
    </div>
    <div v-else-if="showInfo" :class="{success: !warning, warning: warning, error: error}">
      <p v-if="alertText" id="alert">{{ alertText }}</p>
      <div v-if="notReachableEPs.length > 0">
        <p><b>Fehler:</b></p>
        <ul>
          <li v-for="endpoint of notReachableEPs" v-bind:key="endpoint[0].name" class="errors">
            <label>
              {{ endpoint[0].name }} kann nicht importiert werden. ({{ endpoint[2] }})
            </label>
          </li>
        </ul>
      </div>
      <div v-if="alrExistingEPs.length > 0">
        <p><b>Warnungen:</b></p>
        <ul>
          <li v-for="endpoint of alrExistingEPs" v-bind:key="endpoint[0].name">
            Der Endpunkt "{{ endpoint[0].name }}" (URL: {{ endpoint[0].url }}) existiert bereits.
            <label v-if="endpoint[0].name != endpoint[2]">
              <br/>Er ist unter dem Namen "{{ endpoint[2] }}" zu finden.
            </label>
          </li>
        </ul>
        <p v-if="warningText">{{ warningText }}</p>
      </div>
    </div>
    <div v-else>
      <p v-if="alertText" class="errors" id="alert">{{ alertText }}</p>
      <textarea id="importTextArea" v-model="importString" rows="4"></textarea>
    </div>
  </GenericDialog>
</template>

<script lang="ts" src="./ImportEndpointsDialog.ts">

</script>

<style lang="scss" scoped>

.material-icons {
  font-size: 16px;
  display: block;
  font-family: 'Material Icons';
  font-weight: normal;
  font-style: normal;
  line-height: 1;
}

#importTextArea {
  @include input;
  height: 30vh;
  resize: vertical;
  border-radius: 0pt;
}

.spinner {
  width: 30px;
  height: 30px;
  margin: 5% auto;
}

.warning #alert, .warnings {
  color: $warning-color;
}

.error #alert, .errors {
  color: $error-color;
}

.success #alert {
  color: $success-color;
}

</style>
