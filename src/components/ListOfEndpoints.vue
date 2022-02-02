<template>
  <ul>
    <li v-for="endpoint of sparql.state.endpoints" v-bind:key="endpoint.name">
      <label :title="endpoint.url">
        <input type="checkbox" :checked="endpoint.enabled" @click="onEnabledEndpointsChanged(endpoint)">
        <span class="checkmark"></span>
        <span class="label">{{ endpoint.name }}</span>
      </label>
      <span class="material-icons" v-on:click="onEdit(endpoint)">edit</span>
      <span class="material-icons" v-on:click="onRemove(endpoint)">delete_outline</span>
    </li>
  </ul>
</template>

<script lang="ts" src="./ListOfEndpoints.ts">
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
  text-align: left;
  color: $text-main-color;
}

li {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  padding: 0 5px;
  height: 24px;
}

li:nth-child(even) {
  background-color: $highlight-color;
}

.material-icons {
  font-size: 1.5em;
  opacity: 0.5;
  cursor: pointer;
  font-family: 'Material Icons';
  font-weight: normal;
  font-style: normal;
  line-height: 1;
}

.material-icons:hover {
  opacity: 1;
}

ul li label {
  @include custom-checkbox;
  display: block;
  flex: 1 1 auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  user-select: none;
}

</style>
