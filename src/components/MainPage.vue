<template>
  <body>
  <transition-group name="dialog">
    <AddEndpointDialog
        v-if="AddEndpointDialogshown"
        @canceled="hideAddEndpointDialog"
        @submitted="testDialogData"
        header_text="Neue Wissensbasis hinzufügen"
        body_text="Um eine neue Wissensbasis einzubinden, müssen Sie die entsprechende URL angeben:"
        footer_text="*müssen ausgefüllt sein"
    />
    <GenericDialog
        v-if="removingEndpoint != null"
        :buttons="['Entfernen', 'Abbrechen']"
        @clicked="btn => {switch (btn) {case 0: RemoveEndpoint(); case 1: hideRemoveEndpointDialog();}}"
        @close="hideRemoveEndpointDialog"
        header_text="Wissensbasis entfernen"
        max_width="300px"
    >
      <p>Soll die ausgewählte Wissensbasis aus der Liste gelöscht werden?</p>
    </GenericDialog>
    <EditEndpointDialog
        v-if="editingEndpoint != null"
        @canceled="hideEditEndpointDialog"
        @submitted="hideEditEndpointDialog"
        header_text="Wissensbasis editieren"
        body_text="Sie können Namen und URL der ausgewählten Wissensbasis ändern:"
        footer_text="*müssen ausgefüllt sein"
        :currentEndpoint="editingEndpoint"
    />
    <ShareStateDialog
        v-if="isSharingUrl === true"
        @close="hideShareStateDialog"
        :share-url="shareUrl"
        :state-json="shareJsonData"
    >
    </ShareStateDialog>
    <GenericDialog
        v-if="addMissingEndpointsDialogShown"
        :buttons="['Hinzufügen', 'Abbrechen']"
        @clicked="btn => {switch (btn) {case 0: addMissingEndpoints(); case 1: hideAddMissingEndpointsDialog();}}"
        @close="hideAddMissingEndpointsDialog"
        header_text="Wissensbasen hinzufügen"
        max_width="25em"
        buttons_style="justify-content: center;"
    >
      <p>Um den geteilten Zustand vollständig rekonstruieren zu können, müssen neue Endpunkte importiert werden.
        <br/><br/>
        Wollen Sie die erforderlichen Endpunkte jetzt automatisch hinzufügen lassen?</p>
    </GenericDialog>
    <HelpDialog
        v-if="HelpShown"
        @cancel="hideHelp"
    />
    <ExportEndpointsDialog
        v-if="exportEndpointsDialogShown"
        @close="hideExportEndpointsDialog"
    />
    <ImportEndpointsDialog
        v-if="importEndpointsDialogShown"
        @close="hideImportEndpointsDialog"
    />
  </transition-group>
  <div class="main">
    <header>
      <div class="logobox">
        <img src="../assets/Logo.svg" alt="OntoExplorer" class="logo">
      </div>
      <div class="mainmenubox">
        <Tooltip :text="`Projekt-Webseite`">
          <a href="https://github.com/pcp-on-web/ontoexplorer/">
            <button id="infoBtn"><span class="material-icons" style="font-size:26px;">public</span></button>
          </a>
        </Tooltip>
        <Tooltip :text="`Hilfestellung`">
          <button id="helpBtn" v-on:click="showHelp()">
            <span class="material-icons" style="font-size:26px;">help_outline</span>
          </button>
        </Tooltip>
      </div>
    </header>
    <div class="menubox">
      <div class="menu-header">
        <h5 id="base">Wissensbasis</h5>
        <button id="dropdownBtn" v-on:click="toggleDropdown()"><span class="material-icons">more_vert</span></button>
        <div id="dropdown" v-if="showDropdown">
          <div class="dropdown-item" v-on:click="showAddEndpointDialog(),toggleDropdown()"><span class="material-icons">add</span>
            <p>Hinzufügen</p></div>
          <div class="dropdown-item" v-on:click="showExportEndpointsDialog(),toggleDropdown()"><span
              class="material-icons">share</span>
            <p>Exportieren</p></div>
          <div class="dropdown-item" v-on:click="showImportEndpointsDialog(),toggleDropdown()"><span
              class="material-icons">file_upload</span>
            <p>Importieren</p></div>
        </div>
      </div>
      <div class="menucontent">
        <ListOfEndpoints
            @remove="showRemoveEndpointDialog"
            @edit="showEditEndpointDialog"
            @enabledEndpointsChanged="updateURL"
        />
      </div>
    </div>
    <div class="menubox-large">
      <h5>Klassenhierarchie</h5>
      <div class="menucontent">
        <ListOfClasses/>
      </div>
    </div>
    <div class="menubox">
      <h5>Attribute</h5>
      <div class="menucontent">
        <ListOfProperties v-on:finish-load="continueRestoreState()"/>
      </div>
    </div>
    <div class="resultsbox">
      <div class="results-header">
        <button id="returnBtn" :disabled="(selectedInstance === null)" v-on:click="BackButtonClick()">
          <span class="material-icons">chevron_left</span>
        </button>
        <h5>
          {{ resultbox_caption }}
        </h5>
        <button id="shareBtn" :disabled="(ListOfInstancesshown || InstanceInfoTableshown) === false"
                v-on:click="shareStateUrl()">
          <span class="material-icons">share</span>
        </button>
      </div>
      <keep-alive>
        <ListOfInstances
            v-if="!selectedInstance"
            @showInstance="showInstanceInfoTable"/>
      </keep-alive>
      <InstanceInfoTable
          :instance="selectedInstance"
          v-if="selectedInstance"
          @showInstance="showInstanceInfoTable"
      />
    </div>
    <footer>
      <Tooltip :text="versionLong">
        <span>Version&nbsp;{{ versionShort }}</span>
      </Tooltip>
      <img src="../assets/Logo.svg" alt="OntoExplorer" class="small-logo">
    </footer>
  </div>
  </body>
</template>

<script lang="ts" src="./MainPage.ts">


</script>

<style lang="scss">
.resultsbox {
  @include colored-box;
}
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

body {
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
}

header {
  grid-area: header;
  padding: 8px 7px;
  margin: 0px 0px 10px 0px;
  background-color: $header-color;
  align-items: center;
  display: flex;
  position: relative;
  margin-bottom: 2em;
}

footer {
  grid-area: footer;
  padding: 8px 7px;
  background-color: $footer-color;
  bottom: 0;
  left: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  align-items: center;
  column-gap: 50px;
  row-gap: 0.5em;
}

.logobox {
  padding: 8px 7px;
  max-width: 500px;
  overflow: visible;
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translate(-50%, 30%);
}

.logo {
  display: block;
  width: 100%;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.small-logo {
  padding: 5px;
  max-width: 150px;
  float: right;
}

h1 {
  font-size: 24px;
  color: $text-main-color;
}

h5 {
  font-size: 18px;
  font-weight: 500;
}

p {
  margin: 0;
}

.main {
  display: grid;
  grid-template: 100px repeat(4, 1fr) 50px / 1fr 5fr;
  grid-template-areas:
      "header header"
      "menu   results"
      "menu   results"
      "menu   results"
      "menu   results"
      "footer footer";
  width: 100%;
  height: 100vh;
  min-height: 80ex;
  min-width: $absolute-min-width;
  // column-gap: 1em;
}

.menubox {
  @include colored-box;
  min-height: 5em;
  min-width: 20em;
}

.menubox-large {
  @extend .menubox;
  grid-row: span 2;
}

.resultsbox {
  grid-area: results;
}

@media (max-width: $break-max-tablet-pt) {
  .main {
    height: initial;
    grid-template: 150px repeat(5, auto) 50px / 1fr;
    grid-template-areas: 
      "header"
      "menu"
      "menu"
      "menu"
      "menu"
      "results"
      "footer"
  }
  header {
    align-items: flex-start;

    .logobox {
      top: initial;
      width: 80%;

      .logo {
        max-width: 100%;
      }
    }
  }
  .menubox {
    min-height: 10em;
    max-height: 80vh;
    min-width: initial;
  }
}

.menucontent {
  font-size: 14px;
}

.resultscontent {
  font-size: 13px;
}

button {
  background-color: $btn-color;
  border-radius: 6px;
}

#addBtn {
  @include button_icon();
}

#dropdownBtn {
  @include button_icon();
}

#infoBtn, #helpBtn {
  @include button;
  border: none;
  height: 30px;
}

#returnBtn {
  @include button_icon();
  position: absolute;
  left: 0;
  margin-left: 0.2em;
}

#shareBtn {
  @include button_icon();
}

#returnBtn:disabled {
  opacity: 0;
}

.material-icons {
  font-family: 'Material Icons';
  font-weight: normal;
  font-style: normal;
  font-size: 16px;
  display: block;
  line-height: 1;
}

.results-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  h5 {
    margin: 0 1.5em;
    text-align: center;
    flex: 1;
  }
}

.menu-header {
  h5 {
    display: inline;
  }
}

#dropdown {
  background-color: $box-bg-color;
  border-radius: 0 0 0 6px;
  border: solid $box-border-color;
  border-width: 2px 0 2px 2px;
  width: 50%;
  min-width: fit-content;
  float: right;
  padding: 5px 0;
  z-index: 90;
  box-shadow: 3px 3px 5px $shadow-color;
  position: absolute;
  right: 0;
  margin: 0.15em 0;
}

.dropdown-item {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  padding-right: 0.5em;

  p {
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    color: $text-main-color;
    margin: 0;
  }

  .material-icons {
    font-size: 20px;
    opacity: 0.5;
    margin: 0 5px;
  }
}

.dropdown-item:hover {
  cursor: pointer;

  p {
    font-weight: 500;
  }

  .material-icons {
    opacity: 1;
  }
}

@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 400;
  src: url('../assets/fonts/roboto/roboto-v29-latin-regular.eot');
  src: local(''),
  url('../assets/fonts/roboto/roboto-v29-latin-regular.eot?#iefix') format('embedded-opentype'),
  url('../assets/fonts/roboto/roboto-v29-latin-regular.woff2') format('woff2'),
  url('../assets/fonts/roboto/roboto-v29-latin-regular.woff') format('woff'),
  url('../assets/fonts/roboto/roboto-v29-latin-regular.ttf') format('truetype'),
  url('../assets/fonts/roboto/roboto-v29-latin-regular.svg#Roboto') format('svg');
}

@font-face {
  font-family: 'Roboto';
  font-style: italic;
  font-weight: 400;
  src: url('../assets/fonts/roboto/roboto-v29-latin-italic.eot');
  src: local(''),
  url('../assets/fonts/roboto/roboto-v29-latin-italic.eot?#iefix') format('embedded-opentype'),
  url('../assets/fonts/roboto/roboto-v29-latin-italic.woff2') format('woff2'),
  url('../assets/fonts/roboto/roboto-v29-latin-italic.woff') format('woff'),
  url('../assets/fonts/roboto/roboto-v29-latin-italic.ttf') format('truetype'),
  url('../assets/fonts/roboto/roboto-v29-latin-italic.svg#Roboto') format('svg');
}

@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 500;
  src: url('../assets/fonts/roboto/roboto-v29-latin-500.eot');
  src: local(''),
  url('../assets/fonts/roboto/roboto-v29-latin-500.eot?#iefix') format('embedded-opentype'),
  url('../assets/fonts/roboto/roboto-v29-latin-500.woff2') format('woff2'),
  url('../assets/fonts/roboto/roboto-v29-latin-500.woff') format('woff'),
  url('../assets/fonts/roboto/roboto-v29-latin-500.ttf') format('truetype'),
  url('../assets/fonts/roboto/roboto-v29-latin-500.svg#Roboto') format('svg');
}

@font-face {
  font-family: 'Roboto';
  font-style: italic;
  font-weight: 500;
  src: url('../assets/fonts/roboto/roboto-v29-latin-500italic.eot');
  src: local(''),
  url('../assets/fonts/roboto/roboto-v29-latin-500italic.eot?#iefix') format('embedded-opentype'),
  url('../assets/fonts/roboto/roboto-v29-latin-500italic.woff2') format('woff2'),
  url('../assets/fonts/roboto/roboto-v29-latin-500italic.woff') format('woff'),
  url('../assets/fonts/roboto/roboto-v29-latin-500italic.ttf') format('truetype'),
  url('../assets/fonts/roboto/roboto-v29-latin-500italic.svg#Roboto') format('svg');
}

@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 700;
  src: url('../assets/fonts/roboto/roboto-v29-latin-700.eot');
  src: local(''),
  url('../assets/fonts/roboto/roboto-v29-latin-700.eot?#iefix') format('embedded-opentype'),
  url('../assets/fonts/roboto/roboto-v29-latin-700.woff2') format('woff2'),
  url('../assets/fonts/roboto/roboto-v29-latin-700.woff') format('woff'),
  url('../assets/fonts/roboto/roboto-v29-latin-700.ttf') format('truetype'),
  url('../assets/fonts/roboto/roboto-v29-latin-700.svg#Roboto') format('svg');
}

@font-face {
  font-family: 'Roboto';
  font-style: italic;
  font-weight: 700;
  src: url('../assets/fonts/roboto/roboto-v29-latin-700italic.eot');
  src: local(''),
  url('../assets/fonts/roboto/roboto-v29-latin-700italic.eot?#iefix') format('embedded-opentype'),
  url('../assets/fonts/roboto/roboto-v29-latin-700italic.woff2') format('woff2'),
  url('../assets/fonts/roboto/roboto-v29-latin-700italic.woff') format('woff'),
  url('../assets/fonts/roboto/roboto-v29-latin-700italic.ttf') format('truetype'),
  url('../assets/fonts/roboto/roboto-v29-latin-700italic.svg#Roboto') format('svg');
}

@font-face {
  font-family: 'Material Icons Regular';
  font-style: normal;
  font-weight: 400;
  src: local('Material Icons'),
  local('MaterialIcons-Regular'),
  url('../assets/fonts/icons/MaterialIcons-Regular.ttf') format('truetype');
}

@font-face {
  font-family: 'Material Icons';
  font-style: normal;
  font-weight: 400;
  src: local('Material Icons'),
  local('MaterialIconsOutlined-Regular'),
  url('../assets/fonts/icons/MaterialIconsOutlined-Regular.otf') format('opentype');
}

@font-face {
  font-family: 'Material Icons Round';
  font-style: normal;
  font-weight: 400;
  src: local('Material Icons'),
  local('MaterialIconsRound-Regular'),
  url('../assets/fonts/icons/MaterialIconsRound-Regular.otf') format('opentype');
}

@font-face {
  font-family: 'Material Icons Sharp';
  font-style: normal;
  font-weight: 400;
  src: local('Material Icons'),
  local('MaterialIconsSharp-Regular'),
  url('../assets/fonts/icons/MaterialIconsSharp-Regular.otf') format('opentype');
}

@font-face {
  font-family: 'Material Icons TwoTone';
  font-style: normal;
  font-weight: 400;
  src: local('Material Icons'),
  local('MaterialIconsTwoTone-Regular'),
  url('../assets/fonts/icons/MaterialIconsTwoTone-Regular.otf') format('opentype');
}

</style>
