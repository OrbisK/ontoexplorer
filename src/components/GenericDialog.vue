<template>
  <div id="wrapper" @click="close()" :class="{clickable: !modal}">
    <div id="dlgBox" :style="'max-width: '+max_width+((max_height!=null)? '; max-height: '+max_height: '')" @click.stop>
      <h5 id="dlgHeader" :class="{btnSpacing: !modal}">
        <slot name="header">
          {{ header_text }}
          <button @click="close()" id="closeBtn" v-if="!modal">
            <span class="material-icons">close</span>
          </button>
        </slot>
      </h5>
      <div id="dlgBody">
        <slot></slot>
      </div>
      <div id="dlgFooter" v-if="hasFooter">
        <slot name="footer"></slot>
        <div id="dlgButtons" v-if="buttons.length>0" :style="buttons_style!=null? buttons_style: ''">
          <button v-for="(name, index) in buttons" :key="name" @click="clicked(index)">{{ name }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./GenericDialog.ts">

</script>

<style lang="scss" scoped>
#wrapper {
  @include modal-dialog(100%);

  &.clickable {
    cursor: pointer;
  }

  #dlgBox {
    cursor: initial;
    position: relative;

    .btnSpacing {
      padding-right: 1.5em;
      padding-left: 1.5em;
    }
  }
}

#closeBtn {
  @include button_icon();
}

#dlgButtons {
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: stretch;
  margin: 0px 10px;
  gap: 10px;

  button {
    flex: 1 1 0px;
    max-width: 12em;
  }
}

.material-icons {
  font-size: 16px;
  display: block;
  font-family: 'Material Icons';
  font-weight: normal;
  font-style: normal;
  line-height: 1;
}

button {
  @include button;
}

</style>
