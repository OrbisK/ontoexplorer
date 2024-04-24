<script setup lang="ts">
import { buttonProps, useMessage } from 'naive-ui'

const props = defineProps(buttonProps)

const message = useMessage()

const actions = [
  {
    label: 'Edit',
    props: {
      onClick: () => {
        message.info('Edit')
      },
    },
  },
  {
    label: 'Duplicate',
    props: {
      onClick: () => {
        message.info('Duplicate')
      },
    },
  },
  {
    label: 'Delete',
    props: {
      onClick: () => {
        message.info('Delete')
      },
    },
  },
]
</script>

<template>
  <NDropdown :options="actions">
    <NButton v-bind="props">
      .
    </NButton>
  </NDropdown>
</template>
