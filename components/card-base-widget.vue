<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true,
  },
})

const uiOverrides = {
  paddingMedium: `0`,
}
</script>

<template>
  <NCard class="h-full" :title="title" :theme-overrides="uiOverrides" header-class="!p-2">
    <slot />
  </NCard>
</template>
