<script setup lang="ts">
const links = [
  [],
  [{
    label: 'Github',
  }, {
    label: 'Docs',
  }],
]
</script>

<template>
  <div>
    <header class="p-1 border-b border-gray-200 dark:border-gray-800 flex flex-row h-[--header-height]">
      <nuxt-link to="/" class="h-full">
        <nuxt-img src="logo.svg" class="h-full" />
      </nuxt-link>
      <UHorizontalNavigation :links="links" />
    </header>
    <main class="p-4 h-[--body-height]">
      <slot />
    </main>
  </div>
</template>

<style>
html {
  --header-height: 4rem;
  --body-height: calc(100vh - var(--header-height));
}
</style>
