<script setup lang="ts">
const columns = [{
  key: 'name',
  label: 'Name',
}, {
  key: 'actions',
}]

function actions(row) {
  return [
    [{
      label: 'Edit',
      icon: 'i-heroicons-pencil-square-20-solid',
      click: () => console.log('Edit', row.id),
    }, {
      label: 'Duplicate',
      icon: 'i-heroicons-document-duplicate-20-solid',
    }],
    [{
      label: 'Delete',
      icon: 'i-heroicons-trash-20-solid',
    }],
  ]
}

const selected = ref([])
const data = ref([{ name: 'Meine Test DataMeine Test DataMeine Test DataMeine Test Data' }])
</script>

<template>
  <CardBaseWidget title="Wissensbasis">
    <UTable
      v-model="selected"
      :rows="data" :columns :ui="{ td: { base: '' } }"
    >
      <template #actions-data="{ row }">
        <div class="w-6">
          <UDropdown :items="actions(row)">
            <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
          </UDropdown>
        </div>
      </template>
    </UTable>
  </CardBaseWidget>
</template>
