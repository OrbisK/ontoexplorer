<script setup lang="ts">
import { ButtonAction } from '#components'

const columns = [{
  type: 'selection',
}, {
  key: 'name',
  title: 'Name',
  ellipsis: {
    tooltip: true,
  },
}, {
  key: 'actions',
  width: 50,
  render: () => {
    return h(ButtonAction, { size: 'tiny' })
  },
}]

const selected = ref([])
const data = ref([
  { name: 'Meine Test DataMeine Test DataMeine Test DataMeine Test Data' },
  { name: 'Meine Test DataMeine Test DataMeine Test DataMeine Test Data2' },
  { name: 'Meine Test DataMeine Test DataMeine Test DataMeine Test Data3' },
  { name: 'Meine Test DataMeine Test DataMeine Test DataMeine Test Data4' },
  { name: 'Meine Test DataMeine Test DataMeine Test DataMeine Test Data5' },
  { name: 'Meine Test DataMeine Test DataMeine Test DataMeine Test Data6' },
  { name: 'Meine Test DataMeine Test DataMeine Test DataMeine Test Data7' },
  { name: 'Meine Test DataMeine Test DataMeine Test DataMeine Test Data8' },
])
</script>

<template>
  <CardBaseWidget title="Wissensbasis">
    <NDataTable v-model:checked-row-keys="selected" size="small" :columns="columns" :bordered="false" :flex-height="true" class="h-full" :data="data" :row-key="(row) => row.name" />
  </CardBaseWidget>
</template>
