<template>

  <div class="spinner" v-if="waiting">
    <LoadingSpinner/>
  </div>
  <div v-else>
    <!-- <p>Liste der Klassen:</p> -->
    <ul>
      <ExpandableClass v-for="c in classes" :key="c.iri" :classData="c" v-model="selectedClass"
                       v-on:hierarchy-update="passHierarchyUpdate" :depth="0"/>
    </ul>
  </div>

</template>

<script lang="ts" src="./ListOfClasses.ts">


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
p {
  color: $text-main-color;
}

ul {
  list-style-type: none;
  padding: 0;
  text-align: left;
  color: $text-main-color;
}

li {
  display: block;
  padding: 0 10px;
}

li:nth-child(even) {
  background-color: $highlight-color;
}

.spinner {
  margin-top: 18px;
  margin-left: 40%;
  padding: 1px;
  height: 20px;
  width: 20px;

}
</style>
