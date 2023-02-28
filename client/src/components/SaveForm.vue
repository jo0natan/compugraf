<script setup lang="ts">
import { FormInstance } from 'element-plus'
import axios from 'axios'
import { pessoas } from '../type/pessoas'
import { nextTick, onMounted, reactive, ref, watchEffect } from 'vue'
import { rules } from '../utils/validate'
import BaseInput from './BaseInput.vue'

const props = defineProps<{
  value: pessoas
  loading?: boolean
  opened?: boolean
}>()

const loading = ref(false)

const emit = defineEmits<{
  (e: 'submit', value: pessoas): void
  (e: 'cancel'): void
}>()

let form = reactive(props.value)

const position = ref<'left' | 'right' | 'top'>('right')
const ruleFormRef = ref<FormInstance>()

onMounted(() => {
  if (window.screen.width < 767) {
    position.value = 'top'
  }
})

watchEffect(() => {
  const opened = props.opened
  if (opened) {
    nextTick(() => {
      ruleFormRef.value!.clearValidate()
    })
  }
})

const handleSubmit = () => {
  ruleFormRef.value!.validate((valid) => {
    if (valid) {
      emit('submit', form)
    }
  })
}

const fetchCepData = async (cep: any) => {
  try {

    if (cep.length < 9) {
      return
    }

    loading.value = true // adiciona a mensagem de carregando
    const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`)
    const { data } = response
    form.logradouro = data.logradouro
    form.cidade = data.localidade
    form.estado = data.uf
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false // remove a mensagem de carregando
  }
}

const addCepDash = (cep: any) => {
  var cep = cep.replace(/[^\d-]/g, '');
  if (cep.length === 5 && !cep.includes('-')) {
    return cep + '-';
  } else if (cep.length === 6 && cep.endsWith('-')) {
    return cep.slice(0, -1); // remove o último caractere (o traço)
  } else {
    return cep;
  }
};

const formatCPF = (cpf: any) => {
  var cpfNumerico = cpf.replace(/[^\d]/g, ''); // remove todos os caracteres não numéricos
  if (cpfNumerico.length === 11) { // verifica se o CPF possui 11 dígitos
    return cpfNumerico.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4'); // adiciona a máscara "999.999.999-99"
  } else {
    return cpfNumerico;
  }
};

const handleCepInput = () => {
  form.cep = addCepDash(form.cep);
};

const handleCPFInput = () => {
  form.cpf = formatCPF(form.cpf);
};

</script>
<template>
  <el-form ref="ruleFormRef" :model="form" :rules="rules" label-width="80px" class="save-form" :label-position="position">

    <el-form-item label="Nome" prop="nome" :rules="rules.nome">
      <BaseInput v-model="form.nome" />
    </el-form-item>

    <el-form-item label="Sobrenome" prop="sobrenome" :rules="rules.sobrenome">
      <BaseInput v-model="form.sobrenome" />
    </el-form-item>


    <el-row>
      <el-col :span="12">
        <el-form-item label="Nac." prop="nacionalidade">
          <el-select v-model="form.nacionalidade">
            <el-option label="Brasileiro" value="Brasileiro"></el-option>
            <el-option label="Estrangeiro" value="Estrangeiro"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="CPF" prop="cpf" :rules="rules.cpf">
          <BaseInput v-model="form.cpf" maxlength="14" @input="handleCPFInput" />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="12">
        <el-form-item label="E-mail" prop="email" :rules="rules.email">
          <BaseInput v-model="form.email" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="Telefone" prop="telefone" :rules="rules.telefone">
          <BaseInput v-model="form.telefone" />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="8">
        <el-form-item label="CEP" prop="cep" :rules="rules.cep">
          <BaseInput v-model="form.cep" maxlength="9" @input="handleCepInput" @blur="fetchCepData(form.cep)" />
          <div v-if="loading">Buscando cep...</div>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="Cidade" prop="cidade" :rules="rules.cidade">
          <BaseInput v-model="form.cidade" />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="Estado" prop="estado" :rules="rules.estado">
          <BaseInput v-model="form.estado" />
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item label="Logradouro" prop="logradouro" :rules="rules.logradouro">
      <BaseInput v-model="form.logradouro" />
    </el-form-item>

    <el-form-item class="footer-item">
      <el-button @click="emit('cancel')">
        Cancelar
      </el-button>
      <el-button type="primary" :loading="loading" @click="handleSubmit">
        Confirmar
      </el-button>
    </el-form-item>

  </el-form>
</template>

<style lang="scss">
.save-form {
  .el-input {
    width: 100%;
  }

  .footer-item {
    margin-bottom: 0;

    .el-form-item__content {
      justify-content: flex-end;
    }
  }
}
</style>