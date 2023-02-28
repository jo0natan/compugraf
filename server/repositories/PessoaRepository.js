const db = require("../models");
const Op = db.Sequelize.Op;
const Pessoa = db.restCompugraf;

class PessoaRepository {
  

  async createPessoa(pessoaData) {
    const newPessoa = await Pessoa.create(pessoaData);
    return newPessoa;
  }

  async getAllPessoas(offset, limit) {
    const pessoas = await Pessoa.findAndCountAll({
      offset,
      limit
    });
    return pessoas;
  }

  async findPessoaById(id) {
    return await Pessoa.findByPk(id);
  }

  async findPessoaByCpfOrEmail(cpf, email, excludeId = null) {
    let whereClause = { [Op.or]: [{ cpf }, { email }] };
    if (excludeId) {
      whereClause.id = { [Op.ne]: excludeId };
    }
    return await Pessoa.findOne({ where: whereClause });
  }
  
  async updatePessoaByID(id, updatedPessoaData) {
    const [num] = await Pessoa.update(updatedPessoaData, {
      where: { id },
    });
    if (num === 1) {
      const updatedPessoa = await Pessoa.findByPk(id);
      return updatedPessoa;
    } else {
      return null;
    }
  }
  
  async deletePostByID(id) {
    return Pessoa.destroy({ where: { id } })
      .then((num) => {
        if (num === 1) {
          return "OK";
        } else {
          return "ERROR";
        }
      })
      .catch((error) => {
        throw new Error(`Cannot delete Post object with id! ` + error);
      });
  }

  async findAndCountAll(where, limit, offset) {
    return await Pessoa.findAndCountAll({
      where,
      limit,
      offset
    });
  }

}

module.exports = PessoaRepository;
