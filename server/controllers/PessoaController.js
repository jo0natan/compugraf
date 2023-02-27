class PessoaController {
    constructor(pessoaService) {
      this.pessoaService = pessoaService;
    }
  
    async getAllPessoas(request, result) {
        const page = parseInt(request.query._page, 10) || 1;
        const limit = parseInt(request.query._limit, 10) || 15;
        const offset = (page - 1) * limit;
      
        try {
          const { count, rows } = await this.pessoaService.getAllPessoas(offset, limit); // Corrigir aqui
          const totalPages = Math.ceil(count / limit);
          result.send({
            totalPages,
            currentPage: page,
            list: rows,
            count,
          });
        } catch (err) {
            result.status(500).send({
                message: `Some error occurred while retrieving data. Error: ${err.message}`,
              });
        }
    }
  
    async create(request, result) {
      try {
        const { nome, sobrenome, nacionalidade, cpf, email, telefone, cep, logradouro, cidade, estado } = request.body;
        const newPessoa = await this.pessoaService.createPessoa({ nome, sobrenome, nacionalidade, cpf, email, telefone, cep, logradouro, cidade, estado });
        result.send(newPessoa);
      } catch (err) {
        result.status(500).send({
          message: err.message || "Error creating Pessoa.",
        });
      }
    }

    async updatePostByID(request, result) {
        const paramID = request.params.id;
        try {
          const updatedPessoa = await this.pessoaService.updatePessoaByID(paramID, request.body);
      
          if (updatedPessoa && (updatedPessoa.cpf || updatedPessoa.email)) {
            result.send({
              message: "OK",
            });
          } else {
            result.send({
                message: updatedPessoa
            });
          }
        } catch (err) {
          result.status(500).send({
            message: `Error while updating Pessoa object with id ${paramID}. Error: ${err}`,
          });
        }
      }
      
    async deletePostByID(request, result) {
        const id = request.params.id;
        this.pessoaService.deletePostByID(id)
          .then((message) =>
            result.send({
              message: message,
            })
          )
          .catch((err) =>
            result.status(500).send({
              message: `Cannot delete Post object with id!` + err,
            })
          );
    }

    async getSearch(request, response) {
        try {
          const paramSearch = request.query.search;
          const page = parseInt(request.query._page) || 1;
          const limit = parseInt(request.query._limit) || 10;
          const result = await this.pessoaService.searchService(paramSearch, page, limit);
          response.send(result);
        } catch (error) {
          response.status(500).send({
            message: "Something going wrong. Unable to retrieve data!" + error
          });
        }
    }

  }
  
  module.exports = PessoaController;