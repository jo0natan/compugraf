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
        if (!value) {
          callback(new Error('CPF é obrigatório'))
        } else if (!/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/.test(value)) {
          callback(new Error('CPF inválido, precisa estár no formato 000.000.000-00'))
        } else {
          const cpf = value.replace(/[^\d]/g, '')
          let sum = 0
          let remainder
          if (
            cpf === '00000000000' ||
            cpf === '11111111111' ||
            cpf === '22222222222' ||
            cpf === '33333333333' ||
            cpf === '44444444444' ||
            cpf === '55555555555' ||
            cpf === '66666666666' ||
            cpf === '77777777777' ||
            cpf === '88888888888' ||
            cpf === '99999999999'
          ) {
            callback(new Error('CPF inválido'))
            return
          }
          for (let i = 1; i <= 9; i++) {
            sum += parseInt(cpf.substring(i - 1, i)) * (11 - i)
          }
          remainder = (sum * 10) % 11

          if (remainder === 10 || remainder === 11) {
            remainder = 0
          }

          if (remainder !== parseInt(cpf.substring(9, 10))) {
            callback(new Error('CPF inválido'))
            return
          }

          sum = 0
          for (let i = 1; i <= 10; i++) {
            sum += parseInt(cpf.substring(i - 1, i)) * (12 - i)
          }
          remainder = (sum * 10) % 11

          if (remainder === 10 || remainder === 11) {
            remainder = 0
          }

          if (remainder !== parseInt(cpf.substring(10, 11))) {
            callback(new Error('CPF inválido'))
            return
          }

          callback()
        }
      },

      message: 'CPF inválido',
      trigger: 'blur'
    }
  ]

};