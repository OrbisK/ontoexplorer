<template>
  <li>
    <Tooltip :text="`${classData.iri}\nEndpunkte:\n${Array.from(classData.getEndpoints()).join('\n')}`">
      <label>
          <span class="material-icons arrow-right"
                v-on:click="toggleUnfold()"
                :class="{unfolded: unfolded, disabled: !classData.hasSubclasses}"
          >chevron_right</span>
        <span v-on:click="updateSelected(classData.iri)" :class="{selected: isSelected}">
            {{ classData.label }}
            <span v-if="classData.elementCount!=null">({{ classData.elementCount }})</span>
          </span>
      </label>
    </Tooltip>

    <!-- Subclasses: -->
    <template v-if="unfolded">
      <div class="spinnerWrapper" v-if="fetching">
        <LoadingSpinner/>
      </div>
      <ul v-else>
        <ExpandableClass v-for="c in subclasses" :key="c.iri" :classData="c" v-model="subclass"
                         v-on:hierarchy-update="passHierarchyUpdate" :depth="depth + 1"/>
      </ul>
    </template>
  </li>
</template>

<script lang="ts" src="./ExpandableClass.ts">

</script>

<style lang="scss" scoped>
ul {
  list-style-type: none;
  line-height: 1.2;
}

label {
  cursor: pointer;
}

.material-icons {
  float: left;
  font-size: 21px;
  cursor: pointer;
  font-family: 'Material Icons';
  font-weight: normal;
  font-style: normal;
  line-height: 1;
}

.arrow-right {
  transition: transform .2s ease;
  user-select: none;

  &.unfolded {
    transform: rotate(90deg);
  }

  &.disabled {
    cursor: initial;
    opacity: 0.2;
  }
}

.selected {
  font-weight: 500;
}

.spinnerWrapper {
  padding: 0.5em;

  .spinner {
    width: 20px;
    height: 20px;
    margin: auto;
  }
}

</style>
