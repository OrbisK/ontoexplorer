<script setup lang="ts">
import type { BreadcrumbLink } from '#ui/types'

const links = ref<BreadcrumbLink[]>([{
  label: 'Home',
  icon: 'i-heroicons-home',
  to: '/'
}, {
  label: 'Navigation',
  icon: 'i-heroicons-square-3-stack-3d'
}, {
  label: 'Breadcrumb',
  icon: 'i-heroicons-link'
}])
</script>

<template>
  <UBreadcrumb :links="links">
    <template #icon="{ link }">
      <UIcon :name="link.icon" />
    </template>
  </UBreadcrumb>
</template>
