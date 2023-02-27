const db = require("../models");
const Pessoa = db.posts;
const Op = db.Sequelize.Op;

class PessoaService {
  constructor(pessoaRepository) {
    this.pessoaRepository = pessoaRepository;
  }


  async createPessoa(pessoaData) {
    const { cpf, email } = pessoaData;
    const pessoaExists = await this.pessoaRepository.findPessoaByCpfOrEmail(cpf, email);

    if (pessoaExists) {
      const conflictField = cpf === pessoaExists.cpf ? "CPF" : "EMAIL";
      return { message: conflictField };
    }

    const newPessoa = await this.pessoaRepository.createPessoa(pessoaData);
    return newPessoa;
  }

  async getAllPessoas(offset, limit) {
    const pessoas = await Pessoa.findAndCountAll({ offset, limit });
    return pessoas;
  }

  async updatePessoaByID(id, updatedPessoaData) {
    const { cpf, email } = updatedPessoaData;
    const pessoa = await this.pessoaRepository.findPessoaById(id);

    if (pessoa.cpf === cpf && pessoa.email === email) {
      const { cpf, email, ...otherData } = updatedPessoaData;
      const updatedPessoa = await this.pessoaRepository.updatePessoaByID(id, otherData);
      return updatedPessoa;
    }

    const pessoaExists = await this.pessoaRepository.findPessoaByCpfOrEmail(cpf, email, id);

    if (pessoaExists && pessoaExists.id !== id) {
      const conflictField = cpf === pessoaExists.cpf ? "CPF" : "EMAIL";
      return conflictField;
    }
    
    const updatedPessoa = await this.pessoaRepository.updatePessoaByID(id, updatedPessoaData);
    return updatedPessoa;
  }

  async deletePostByID(id) {
    return this.pessoaRepository.deletePostByID(id);
  }


  async searchService(paramSearch, page, limit) {
    const where = paramSearch ? {
      [Op.or]: [
        { nome: { [Op.like]: `%${paramSearch}%` } },
        { sobrenome: { [Op.like]: `%${paramSearch}%` } },
        { nacionalidade: { [Op.like]: `%${paramSearch}%` } },
        { cpf: { [Op.like]: `%${paramSearch}%` } },
        { email: { [Op.like]: `%${paramSearch}%` } },
        { telefone: { [Op.like]: `%${paramSearch}%` } },
        { cep: { [Op.like]: `%${paramSearch}%` } },
        { logradouro: { [Op.like]: `%${paramSearch}%` } },
        { cidade: { [Op.like]: `%${paramSearch}%` } },
        { estado: { [Op.like]: `%${paramSearch}%` } }
      ]
    } : {};

    const offset = (page - 1) * limit;
    const { count, rows } = await this.pessoaRepository.findAndCountAll(where, limit, offset);

    return {
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      list: rows,
      count
    };
  }

}

module.exports = PessoaService;