<script setup lang="ts">
import {
  computed,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  watchEffect,
} from 'vue'

import { ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { debounce } from 'lodash'

import { pessoas, pesquisa } from './type/pessoas'
import SearchForm from './components/SearchForm.vue'
import SaveForm from './components/SaveForm.vue'
import BasePagination from './components/BasePagination.vue'
import { ElMessage } from 'element-plus'

import {
  addPessoa,
  delReceipt,
  editPessoa,
  getPessoastList,
  getPessoasSearch
} from './api/pessoa'

type FormKey = keyof pessoas
type SearchParams = Params & pesquisa

const dialogVisible = ref(false)
const adding = ref(false)
const loading = ref(false)
const saveLoading = ref(false)

const tableData = ref<pessoas[]>([])
const PAGE_SIZE = 15
const tableHeight = ref(0)

let form = reactive<pessoas>({})

let params = reactive<Params>({
  _page: 1,
  _limit: PAGE_SIZE,
  _sort: 'id',
  _order: 'desc'
})

const total = ref(0)
const layout = ref()
const total_corrent = ref();
const currentPage = ref(1);

const title = computed<string>(() => {
  if (adding.value) return 'Adicionar nova pessoa ao banco de dados'
  return 'Editar dados pessoais'
})

const fetchData = (params: SearchParams) => {
  loading.value = true
  getPessoastList(params)
    .then((data: PageTable<pessoas>) => {
      loading.value = false
      tableData.value = data.list ?? []
      total.value = data.totalPages
      total_corrent.value = data.count
    })
    .catch(() => {
      loading.value = false
    })
}

const fetchDataSearch = (params: SearchParams) => {
  loading.value = true
  getPessoasSearch(params)
    .then((data: PageTable<pessoas>) => {
      loading.value = false
      tableData.value = data.list ?? []
      total.value = data.totalPages
      total_corrent.value = data.count
    })
    .catch(() => {
      loading.value = false
    })
}

const handleSearch = (keyword?: pesquisa) => {
  // merge params
  const value = {
    ...params,
    _page: 1,
    ...keyword
  }
  fetchData(value)
}

handleSearch()

const handleSearchSubmit = (keyword?: pesquisa) => {
  // merge params
  const value = {
    ...params,
    _page: 1,
    ...keyword
  }
  fetchDataSearch(value)
}

// fetch first page data
const refresh = () => {
  params._page = 1
  fetchData(params)
}

watchEffect(() => {
  if (!saveLoading.value) {
    dialogVisible.value = false
  }
})

const toAdd = () => {
  adding.value = true
  dialogVisible.value = true
  // reset form
  Object.keys(form).forEach((item) => {
    const key = item as FormKey
    form[key] = undefined
  })
}

const toEdit = (row: pessoas) => {

  //form = Object.assign('', 0)
  const value = {
    ...params,
    _page: currentPage.value,

  }

  //fetchData(value)

  adding.value = false;
  dialogVisible.value = true;
  form = Object.assign(form, row)
}

const toDelete = (id: number) => {
  ElMessageBox.confirm('Tem certeza que deseja excluir?', {
    title: 'Deletar Dados Pessoais',
    type: 'warning',
    confirmButtonText: 'Confirmar',
    beforeClose: (action, instance, done) => {
      if (action === 'confirm') {
        instance.confirmButtonLoading = true
        instance.confirmButtonText = 'Executando...'
        delReceipt(id).then(() => {
          instance.confirmButtonLoading = false
          done()
          // not call fetchData
          const index = tableData.value.findIndex((item) => item.id === id)
          tableData.value.splice(index, 1)
          total.value -= 1
          if (total.value % params._limit === 0) {
            refresh()
          }
        })
      } else {
        done()
      }
    }
  })
}

const handleSubmit = (form: pessoas) => {
  if (adding.value) {
    doAdd(form)
  } else {
    doEdit(form)
  }
}

const doAdd = (params: pessoas) => {
  saveLoading.value = true
  addPessoa(params)
    .then((response) => {

      if (response.message === "CPF") {
        ElMessageBox.alert(
          'CPF já se encontra em nossa base de dados.',
          'Atenção')
        return
      }

      if (response.message === "EMAIL") {
        ElMessageBox.alert(
          'O Endereço de e-mail já existe em nosso banco de dados',
          'Atenção')
        return
      }
      saveLoading.value = false
      refresh()
      ElMessage({
        message: 'Dados adicionados com sucesso',
        type: 'success'
      })
    })
    .catch((response) => {
      saveLoading.value = false
    })
}

const doEdit = async (data: pessoas) => {
  saveLoading.value = true;
  
  try {
    const response = await editPessoa(data);
    const { message } = response;

    if (message === "CPF" || message === "EMAIL") {
      ElMessageBox.alert(
        message === "CPF"
          ? "CPF já se encontra em nossa base de dados."
          : "O Endereço de e-mail já existe em nosso banco de dados",
        "Atenção"
      );
      return;
    }

    const index = tableData.value.findIndex((item) => item.id === data.id);

    if (tableData.value[index].id === data.id && message === "OK") {
      const value = {
        ...params,
        _page: currentPage.value,
      };

      await fetchData(value);

      ElMessage({
        message:
          "Dados pessoais de " +
          tableData.value[index].nome +
          " alterados com sucesso!",
        type: "success",
      });

      saveLoading.value = false;
    }
  } catch (error) {
    saveLoading.value = false;
  }
};

const responsive = () => {
  if (document.body.clientWidth < 768) {
    layout.value = 'prev, pager, next'
  } else {
    layout.value = undefined
  }
  const el = document.getElementById('searchForm') as HTMLElement
  tableHeight.value = document.body.clientHeight - el.clientHeight - 140
}

onMounted(() => {
  window.addEventListener('resize', debounce(responsive, 500))
  responsive()

})

onUnmounted(() => {
  window.removeEventListener('resize', responsive)
})

const handlePageChange = async (page: number) => {
  currentPage.value = page;
};
</script>

<template>
  <div id="app">
    <SearchForm id="searchForm" @search="handleSearchSubmit" />
    <div class="box">
      <el-button type="primary" :icon="Plus" @click="toAdd">
        Adicionar
      </el-button>
    </div>
    <el-table v-loading="loading" :data="tableData" :border="true" :height="tableHeight" class="main-table">

      <el-table-column prop="nome" label="Nome" sortable />

      <el-table-column prop="sobrenome" label="Sobrenome" sortable />

      <el-table-column prop="nacionalidade" label="Nac." min-width="55" />

      <el-table-column prop="cpf" label="CPF" sortable />

      <el-table-column prop="email" label="E-mail" sortable />

      <el-table-column prop="telefone" label="Telefone" sortable />

      <el-table-column prop="cep" label="CEP" sortable min-width="55" />

      <el-table-column prop="logradouro" label="Logradouro" sortable />

      <el-table-column prop="cidade" label="Cidade" sortable />

      <el-table-column prop="estado" label="UF" min-width="35" />

      <el-table-column v-if="tableData.length > 0" :fixed="layout ? 'right' : false" label="Ação" min-width="100"
        align="center">
        <template #default="{ row }">
          <el-tag type="warning" @click="toDelete(row.id)">
            Excluir
          </el-tag>
          <el-tag @click="toEdit(row)">
            Editar
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="dialogVisible" :title="title" :close-on-click-modal="false">
      <SaveForm :value="form" :opened="dialogVisible" :loading="saveLoading" @submit="handleSubmit"
        @cancel="dialogVisible = false" />
    </el-dialog>
    <BasePagination v-model:page="params._page" v-model:limit="params._limit" :total="total_corrent" :layout="layout"
      @click="handlePageChange(params._page)" @pagination="fetchData(params)" />
  </div>
</template>

<style>
#app {
  display: flex;
  flex-direction: column;
  height: 100%;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
}
</style>
