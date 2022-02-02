<template>
  <div class="table">
    <div class="spinnerWrapper" v-if="instance.getAttributes().size==0 && loading>0">
      <LoadingSpinner/>
    </div>
    <table v-else>
      <col span="1" class="attribute">
      <col span="1" class="values">
      <thead>
      <tr class="tablehead">
        <th class="attributes">Attribute</th>
        <th>Daten</th>
      </tr>
      </thead>
      <tbody>
      <template v-for="[property, attributes] in instance.getAttributes()" :key='property.iri'>
        <tr>
          <td class="attributes" :title="property.iri">{{ property.label }}</td>
          <td>
            <ul class="same-predicate-list">
              <li
                  v-for="attribute in attributes"
                  :key="attribute.iri || attribute"
                  :class="{object: isObject(attribute)}">
                <a :href="attribute.iri" target="_blank" v-if="isObject(attribute)" class="material-icons"
                   :title="attribute.iri">link</a>
                <template v-if="attribute?.hasProps">
                          <span v-on:click="toggleSubtable(property.iri,attribute.iri)"
                                class="material-icons toggle-subtable hover"
                                :class="{expanded: showSubtable(property.iri,attribute.iri)}">
                            chevron_right
                          </span>
                  <a
                      @click.prevent.stop="showInstance(attribute)"
                      :href="getAttributeStateURL(attribute.iri)"
                      :title="attribute.iri">
                    {{ attribute.label }}
                  </a>
                  <div class="box" v-if="showSubtable(property.iri,attribute.iri)">
                    <h5>Eigenschaften von '{{ attribute.label }}'</h5>
                    <InstanceInfoTable
                        v-if="showSubtable(property.iri,attribute.iri)"
                        :instance="attribute"
                        @showInstance="showInstance"/>
                  </div>
                </template>
                <span v-else :title="attribute?.iri">{{ attribute.label || attribute }}</span>
              </li>
            </ul>
          </td>
        </tr>
      </template>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" src="./InstanceInfoTable.ts">


</script>

<style lang="scss" scoped>
.box {
  @include colored-box();
}

.spinnerWrapper {
  height: 20px;
  width: 20px;
  margin: auto;
  padding: 1em;
}

.toggle-subtable {
  cursor: pointer;
  display: inline-block;
  transition: transform .2s ease;

  &.expanded {
    transform: rotate(90deg);
  }
}

table {
  min-width: 100%;
  margin-top: 1em;
  font-size: 14px;
  line-height: 1.5;
  border-collapse: collapse;

  th {
    text-align: start;
  }

  col.attribute {
    min-width: 0px;
  }

  col.values {
    min-width: 10em;
  }
}

tbody {
  vertical-align: top;

  > tr:nth-child(2n+1) {
    background-color: $highlight-color;
  }
}

.same-predicate-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.tablehead {
  color: $primary-color;
  font-weight: bold;
}

.attributes {
  padding: 0 1em;
  white-space: nowrap;
}

td.attributes {
  font-weight: 500;
}

.material-icons {
  font-size: 20px;
  vertical-align: middle;
  user-select: none;
  font-family: 'Material Icons';
  font-weight: normal;
  font-style: normal;
  line-height: 1;
}

.hover {
  opacity: 0.6;
}

.hover:hover {
  opacity: 1;
}


</style>
