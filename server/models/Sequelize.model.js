module.exports = (database, Sequelize) => {
  return database.define("restCompugraf", {
    nome: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    sobrenome: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    nacionalidade: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    cpf: {
      type: Sequelize.STRING(14),
      allowNull: false,
      unique: true,
      validate: {
        isCpfValid(value) {
          if (!value.match(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/)) {
            throw new Error("CPF inválido");
          }

          const cleanCpf = value.replace(/[^\d]/g, "");

          let sum = 0;
          let remainder;

          if (cleanCpf == "00000000000") {
            throw new Error("CPF inválido");
          }

          for (let i = 1; i <= 9; i++) {
            sum += parseInt(cleanCpf.substring(i - 1, i)) * (11 - i);
          }

          remainder = (sum * 10) % 11;

          if (remainder == 10 || remainder == 11) {
            remainder = 0;
          }

          if (remainder != parseInt(cleanCpf.substring(9, 10))) {
            throw new Error("CPF inválido");
          }

          sum = 0;

          for (let i = 1; i <= 10; i++) {
            sum += parseInt(cleanCpf.substring(i - 1, i)) * (12 - i);
          }

          remainder = (sum * 10) % 11;

          if (remainder == 10 || remainder == 11) {
            remainder = 0;
          }

          if (remainder != parseInt(cleanCpf.substring(10, 11))) {
            throw new Error("CPF inválido");
          }
        },
      },
    },
    cep: {
      type: Sequelize.STRING(9),
      allowNull: false,
      validate: {
        is: /^(\d{5}-?\d{3})$/,
      },
    },
    estado: {
      type: Sequelize.STRING(2),
      allowNull: false,
    },
    cidade: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    logradouro: {
      type: Sequelize.STRING(200),
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    telefone: {
      type: Sequelize.STRING(20),
      allowNull: false,
    },
  });
};
