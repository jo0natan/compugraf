class CPFValidator {
    static isValidCPF(cpf: string): boolean {
      cpf = cpf.replace(/[^\d]+/g, ''); // remove caracteres não numéricos
      if (cpf.length !== 11) {
        return false;
      }
      // Verifica se todos os dígitos são iguais
      for (let i = 0; i < 10; i++) {
        if (cpf.substring(i, i + 1) !== cpf.substring(i + 1, i + 2)) {
          break;
        }
        if (i === 9) {
          return false;
        }
      }
      let soma = 0;
      let resto;
      for (let i = 1; i <= 9; i++) {
        soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
      }
      resto = (soma * 10) % 11;
      if (resto === 10 || resto === 11) {
        resto = 0;
      }
      if (resto !== parseInt(cpf.substring(9, 10))) {
        return false;
      }
      soma = 0;
      for (let i = 1; i <= 10; i++) {
        soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
      }
      resto = (soma * 10) % 11;
      if (resto === 10 || resto === 11) {
        resto = 0;
      }
      if (resto !== parseInt(cpf.substring(10, 11))) {
        return false;
      }
      return true;
    }
  }

  export {CPFValidator};