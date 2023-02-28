
/// conversão padrão SOLID 

const Sequelize = require('sequelize');
const cpfValidator = require('./cpfValidator');

class RestCompugraf {
  constructor(sequelize) {
    this.model = sequelize.define("restCompugraf", {
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
            if (cpfValidator.isCpfValid(value)) {
              throw new Error('CPF inválido');
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
  }
}  
module.exports = RestCompugraf;