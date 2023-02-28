import { CPFValidator } from './CPFValidator';


interface Rules {
  [key: string]: FormItemRule[];
}

export const rules: Rules = {
  nome: [{ required: true, message: 'Campo nome é obrigatório', trigger: 'blur' }],
  sobrenome: [{ required: true, message: 'Campo sobrenome é obrigatório', trigger: 'blur' }],
  nacionalidade: [{ required: true, message: 'Campo nacionalidade é obrigatório', trigger: 'blur' }],
  email: [{ required: true, message: 'Campo e-mail é obrigatório', trigger: 'blur' }],
  telefone: [{ required: true, message: 'Campo telefone é obrigatório', trigger: 'blur' }],
  cep: [
    { required: true, message: 'Campo CEP é obrigatório', trigger: 'blur' },
    { pattern: /[0-9]{5}-[0-9]{3}/, message: 'CEP inválido, precisa estar no formato 99999-999', trigger: 'blur' },
  ],
  logradouro: [{ required: true, message: 'Campo logradouro é obrigatório', trigger: 'blur' }],
  cidade: [{ required: true, message: 'Campo cidade é obrigatório', trigger: 'blur' }],
  estado: [{ required: true, message: 'Campo estado é obrigatório', trigger: 'blur' }],
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