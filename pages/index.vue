<script setup lang="ts">
</script>

<template>
  <div class="lg:grid grid-cols-[400px__1fr] grid-rows-12  gap-4 flex flex-col h-full min-h-64">
    <section class="row-span-4 col-start-1">
      <CardKnowlegeBase />
    </section>
    <section class="row-span-5 col-start-1">
      <CardBaseWidget title="Klassenhierarchie" />
    </section>
    <section class="row-span-3 col-start-1">
      <CardBaseWidget title="Attribute" />
    </section>
    <section class="col-start-2 row-start-1 row-span-full">
      <UCard class="h-full">
        test 2
      </UCard>
    </section>
  </div>
</template>
