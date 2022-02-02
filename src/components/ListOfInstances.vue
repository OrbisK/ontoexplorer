<template>
  <div class="liste" id="LOIwrapper">
    <table v-if="shownInstances.length">
      <col span="1" class="number">
      <col span="1" class="label">
      <col span="1" class="property" v-for="p in selectedProperties" :key=p.iri>
      <thead>
      <tr>
        <th></th>
        <th>Label / IRI</th>
        <th v-for="p in selectedProperties" :key="p.iri" :title="p.iri">
          {{ p.label }}
        </th>
      </tr>
      </thead>
      <tbody id="contentTbody">
      <template v-for="(element, index) in shownInstances" :key="index +'-'+ element.iri">
        <tr class="list-item">
          <td class="number">
            {{ index + 1 + ((currentPage - 1) * maxCount) }}.
          </td>
          <td class="label" v-on:click="onInstanceClick(element)" :title="element.iri">
            {{ element.label }}
          </td>
          <td v-for="p in selectedProperties" :key=p.iri class="property">
            <ul class="same-predicate-list" v-if="element.getAttributesOfProperty(p.iri).size > 0">
              <li
                  v-for="a in element.getAttributesOfProperty(p.iri)"
                  :key="a">
                <a :href="a.iri" target="_blank" v-if="isObject(a)" class="material-icons object"
                   :title="a.iri">link</a>
                <span v-if="isObject(a) && a.hasProps" v-on:click="onInstanceClick(a)" class="object">{{
                    a.label
                  }}</span>
                <span v-else>{{ a.label || a }}</span>
              </li>
            </ul>
            <div class="attribute-spinner" v-else-if="fetchingAttributes">
                <span>
                  <LoadingSpinner/>
                </span>
            </div>
            <span v-else>
                &ndash;
              </span>
          </td>
        </tr>
        <tr class="additional-info">
          <td></td>
          <td :colspan="2+(selectedProperties.length)" class="classInfoContent"></td>
        </tr>
      </template>
      </tbody>
    </table>
  </div>

  <div class="navigation" v-if="shownInstances.length">
    <div class="navigation-label">
        <span>
          Elemente {{ (currentPage - 1) * maxCount + 1 }}&ndash;{{ (currentPage - 1) * maxCount + shownInstances.length }}
          <template
              v-if="classInfo.current.value.elementCount != null">von {{ classInfo.current.value.elementCount }}</template>
        </span>
    </div>
    <div class="buttons">
      <button class="button_left" :disabled="(currentPage === 1)"
              @click="currentPage--;pageInstances();endOfList=false;">
        <span class="material-icons">chevron_left</span>
      </button>
      <button class="button_right" :disabled="endOfList === true" @click="ForwardBtn()">
        <span class="material-icons">chevron_right</span>
      </button>
    </div>
    <select id="MaxCountDropDown" v-on:change="setMaxCount()">
      <option id="selectedoption" selected>25</option>
      <option>50</option>
      <option>75</option>
      <option>100</option>
      <option>125</option>
      <option>150</option>
    </select>
  </div>

</template>

<script lang="ts" src="./ListOfInstances.ts">

</script>

<style lang="scss" scoped>
div {
  text-align: left;
  font-size: 14px;
  padding: 0;
}

.list-item {
  .label, .classListInfoIcon, .object {
    cursor: pointer;
  }
}

.list-item:hover {
  &, + .additional-info {
    background-color: $tertiary-color;
  }
}

.same-predicate-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

table {
  line-height: 1.5;
  min-width: 100%;
  table-layout: fixed;
  border-collapse: collapse;

  tr {
    padding: 0 10;

    td {
      overflow: hidden;
      text-overflow: ellipsis;
      vertical-align: top;

      &.number {
        text-align: right;
      }

      &:first-of-type {
        padding-left: 1em;
      }

      &:last-of-type {
        padding-right: 1em;
      }
    }

    &.additional-info {
      display: none;
    }
  }

  thead {
    color: $primary-color;
    font-weight: bold;

    th {
      position: sticky;
      vertical-align: bottom;
      top: 0;
      padding-top: 1em;
      background: rgba($box-bg-color, 0.9);
      z-index: 1;
    }
  }

  tbody {
    tr:nth-child(4n+1), tr:nth-child(4n+2) {
      background-color: $highlight-color;
    }
  }

  col {
    min-width: 15em; // oder Alternativ width
    &.number, &.classListInfoIcon {
      min-width: initial;
      width: 0px;
    }
  }
}

/*
.classInfoContent {
  ul{
    list-style-type: none;
    margin: 0;
    padding:0;
    color: var(--menu-color);
  }
  li::before{
    content: "►";
  }
  li {
    display: inline-block;
  }
}*/

mark {
  background: $secondary-color;
}

button {
  @include button_icon;
  margin: .2em;
}

.material-icons {
  font-size: 20px;
  display: inline !important;
  vertical-align: middle;
  user-select: none;
  font-family: 'Material Icons';
  font-weight: normal;
  font-style: normal;
  line-height: 1;
}


.navigation {
  display: flex;
  flex: 0 0 auto;
  flex-direction: row;
  flex-wrap: wrap;
  column-gap: 1em;
  justify-content: center;
  align-items: center;
  color: $box-header-color;
  background-color: $box-border-color;
  padding-top: 0.2em;
  bottom: 0px;

  .navigation-label {
    flex: 0 0 auto;
    font: {
      size: 18px;
      weight: 500;
    }
  }
}

.attribute-spinner {
  text-align: center;

  > span {
    display: inline-block;
    height: 1em;
    width: 1em;
  }
}

p {
  margin-right: 5px;
}

select {
  height: 20px;
  width: 3.2em;
  border-radius: 6px;
  border: none;
  background-color: $btn-color;
  color: $text-main-color;
  font: {
    size: 15px;
    weight: 500;
  }
}

select:hover {
  cursor: pointer;
}
</style>
