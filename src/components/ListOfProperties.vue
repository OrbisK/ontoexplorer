<template>
  <div class="spinner" v-if="waiting">
    <LoadingSpinner/>
  </div>
  <div v-else class="container">
    <label v-for="[prop,enabled] of property.state.properties" v-bind:key="prop.label" :class="{ 'checked': enabled }">
      <input type="checkbox" :checked="enabled" @change="property.setPropertyEnabled(prop,!enabled)">
      {{ prop.label }}
    </label>
  </div>
</template>

<script lang="ts" src="./ListOfProperties.ts">
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.spinner {
  margin-top: 18px;
  margin-left: 40%;
  padding: 1px;
  height: 20px;
  width: 20px;
}

mark {
  background: $secondary-color;
}

.container {
  display: flex;
  flex-wrap: wrap;
  padding: 0.25em;
}

label {
  box-sizing: border-box;
  border: 1px solid $highlight-color;
  border-radius: 4px;
  box-shadow: 1px 1px 4px $shadow-color;
  margin: 0.25em;
  padding: 3px;
  text-align: center;
  display: inline-block;
  background: $highlight-color;
  flex-grow: 1;
  flex-shrink: 1;
  cursor: pointer;
}

label:hover {
  font-weight: bold;
  padding: 3px 2px;
}

input {
  visibility: hidden;
  position: absolute;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}

.checked {
  background: $primary-color;
  border-color: $primary-color;
  color: $bg-color;
  font-weight: bold;
  padding: 3px 2px;
}
</style>
