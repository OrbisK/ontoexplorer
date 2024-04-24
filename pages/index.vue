<script setup lang="ts">
</script>

<template>
  <div class="lg:grid grid-cols-[400px_1fr] grid-rows-12  gap-4 flex flex-col h-full">
    <section class="row-span-4 col-start-1 lg:min-h-0 min-h-64">
      <CardKnowlegeBase />
    </section>
    <section class="row-span-5 col-start-1 lg:min-h-0 min-h-64">
      <CardBaseWidget title="Klassenhierarchie" />
    </section>
    <section class="row-span-3 col-start-1 lg:min-h-0 min-h-32">
      <CardBaseWidget title="Attribute" />
    </section>
    <section class="col-start-2 row-start-1 row-span-full lg:min-h-0 min-h-128">
      <CardBaseWidget title="View" />
    </section>
  </div>
</template>
