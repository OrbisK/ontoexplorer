<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true,
  },
})

const uiOverrides = {
  body: {
    base: '',
    background: '',
    padding: '',
  },
}
</script>

<template>
  <UCard :ui="uiOverrides" class="h-full">
    <template #header>
      {{ title }}
    </template>

    <slot />
  </Ucard>
</template>
