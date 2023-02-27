<script setup lang="ts">
import { computed, reactive, ref, toRef, watch } from 'vue'
import { pesquisa } from '../type/pessoas'
import { Search } from '@element-plus/icons-vue'
import BaseInput from './BaseInput.vue'

const form: pesquisa = reactive({})

const emit = defineEmits<{
  (e: 'search', query: pesquisa): void;
}>()

const handleSearch = () => {
  emit('search', form)
}

const limparBusca = () => {
  form.search = '';
  emit('search', form)
}

</script>
<template>
  <dl class="search-form" data-testid="search-form" @keyup.enter="handleSearch">
    <dd class="item">
      <BaseInput v-model="form.search" @clear="limparBusca" placeholder="Pesquisar" />
    </dd>

    <dd class="item">
      <el-button type="primary" plain :icon="Search" title="Pesquisar" @click="handleSearch" />
    </dd>
  </dl>
</template>

<style lang="scss">
.search-form {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;

  .item {
    margin-right: 10px;
    margin-bottom: 10px;

    .el-input,
    .base-select,
    .base-date-picker {
      width: 140px;
    }

    .el-input+.el-input {
      margin-left: 10px;
    }

    .base-select+.base-select {
      margin-left: 10px;
    }

    .el-button {
      margin-left: 20px;
    }
  }
}

@media screen and (max-width: 767px) {
  .search-form {
    .item {
      width: 100%;
      display: flex;
      justify-content: space-between;
      .el-input,
      .base-select {
        width: 100%;
      }
    }
  }
}
</style>
