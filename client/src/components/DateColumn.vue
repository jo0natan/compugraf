<script setup lang="ts">

withDefaults(
  defineProps<{
    format?: string
  }>(),
  {
    format: '{y}-{m}-{d}'
  }
)
</script>

<template>
  <el-table-column
    v-bind="$attrs"
    min-width="100"
    sortable
    show-overflow-tooltip
  >
    <template #default="scope">
     
    </template>
  </el-table-column>
</template>
