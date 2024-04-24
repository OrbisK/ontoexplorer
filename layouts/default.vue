<script setup lang="ts">
</script>

<template>
  <NLayout>
    <NLayoutHeader bordered class="h-[--header-height]">
      <nuxt-link to="/" class="h-full">
        <nuxt-img src="logo.svg" class="h-full" />
      </nuxt-link>
    </NLayoutHeader>
    <n-scrollbar class="max-h-[--body-height] h-full">
      <main class="p-4 h-[--body-height] min-h-128 box-border">
        <slot />
      </main>
    </n-scrollbar>
  </NLayout>
</template>

<style>
html {
  --header-height: 4rem;
  --body-height: calc(100vh - var(--header-height));
}
</style>
