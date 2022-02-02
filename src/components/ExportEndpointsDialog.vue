<template>
  <GenericDialog
      header_text="Endpunkte exportieren"
      max_width="800px"
      :buttons="['Kopieren']"
      @clicked="btn => copyExportString()"
      @close="close"
  >
    <template #default>
      <div id="endpointList">
        <div class="endpointItem" v-for="(endpoint, index) in endpoints" v-bind:key="endpoint[0].name">
          <label class="checkbox">
            <input type="checkbox" checked @click="toggleChecked(index)">
            <div class="checkmark"></div>
            <div class="label">{{ endpoint[0].name }}</div>
          </label>
        </div>
      </div>
    </template>
    <template #footer>
      <textarea id="exportTextArea" readonly v-model="exportString" rows="4"></textarea>
    </template>
  </GenericDialog>
</template>

<script lang="ts" src="./ExportEndpointsDialog.ts">

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

#endpointList {
  width: 60%;
  margin: auto;
}

.endpointItem {
  margin: 10px 0;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  align-content: stretch;
}

.endpointItem .label {
  align-self: flex-start;
}

.endpointItem .checkbox {
  align-self: flex-start;
}

textarea {
  @include input;
  height: 30vh;
  min-height: 5em;
  max-height: 60vh;
  resize: vertical;
  border-radius: 0pt;
}

.checkbox {
  @include custom-checkbox;
}

@media (max-height: 400px) {
  textarea {
    resize: none;
    max-height: 30vh;
  }
}

</style>
