import { CPFValidator } from './CPFValidator';


interface Rules {
  [key: string]: FormItemRule[];
}

export const rules: Rules = {
  nome: [{ required: true, message: 'Nome é obrigatório', trigger: 'blur' }],
  sobrenome: [{ required: true, message: 'Sobrenome é obrigatório', trigger: 'blur' }],
  nacionalidade: [{ required: true, message: 'Nacionalidade é obrigatório', trigger: 'blur' }],
  email: [{ required: true, message: 'E-mail é obrigatório', trigger: 'blur' }],
  telefone: [{ required: true, message: 'Telefone é obrigatório', trigger: 'blur' }],
  cep: [
    { required: true, message: 'CEP é obrigatório', trigger: 'blur' },
    { pattern: /[0-9]{5}-[0-9]{3}/, message: 'CEP inválido, precisa estar no formato 99999-999', trigger: 'blur' },
  ],
  logradouro: [{ required: true, message: 'Logradouro é obrigatório', trigger: 'blur' }],
  cidade: [{ required: true, message: 'Cidade é obrigatório', trigger: 'blur' }],
  estado: [{ required: true, message: 'Estado é obrigatório', trigger: 'blur' }],
  cpf: [
    {
      required: true,
      message: 'CPF é obrigatório'
    },
    {
      validator: (_rule, value, callback) => {
        if (!CPFValidator.isValidCPF(value)) {
          callback(new Error('CPF inválido'));
        } else {
          callback();
        }
      },

      message: 'CPF inválido',
      trigger: 'blur'
    }
  ]

};