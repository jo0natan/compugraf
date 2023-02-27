const db = require("../models");
const postObj = db.posts;
const Op = db.Sequelize.Op;

/**
 * Cria uma nova pessoa se o CPF ou e-mail ainda não existir no banco de dados, ou retorna a pessoa correspondente se já existir.
 * @param {Object} request - O objeto de requisição HTTP contendo as informações da pessoa a ser criada.
 * @param {Object} result - O objeto de resposta HTTP.
 * @returns {Promise<void>} A pessoa recém-criada, ou a pessoa já existente se o CPF ou e-mail já estiver cadastrado.
 * Em caso de CPF ou e-mail já cadastrado, retorna uma mensagem indicando o conflito.
 * todos os campos são obrigatorios
*/
exports.create = async (request, result) => {
	try {
		const { nome, sobrenome, nacionalidade, cpf, email, telefone, cep, logradouro, cidade, estado } = request.body;

		const [newPessoa, created] = await postObj.findOrCreate({
			where: { [Op.or]: [{ cpf }, { email }], },
			defaults: { nome, sobrenome, nacionalidade, cpf, email, telefone, cep, logradouro, cidade, estado }
		});

		if (!created) {
			// Se o registro já existir, envia uma resposta com status 200 com a variavel de interpretação para o front
			return result.status(200).send({
				message: cpf === newPessoa.cpf ? "CPF" : "EMAIL",
			});
		}

		result.send(newPessoa);
	} catch (err) {
		result.status(500).send({
			message: err.message || "Error creating Pessoa.",
		});
	}
};

/**
 * Retorna uma lista de todos os objetos Post com paginação.
 * @param {Object} request - O objeto de requisição HTTP contendo os parâmetros de paginação.
 * @param {Object} result - O objeto de resposta HTTP.
 * @returns {Promise<void>} Uma lista de objetos Post com metadados de paginação.
*/

exports.getAllPosts = async (request, result) => {
  const page = parseInt(request.query._page, 10) || 1;
  const limit = parseInt(request.query._limit, 10) || 15;
  const offset = (page - 1) * limit;

  try {
    const { count, rows } = await postObj.findAndCountAll({
      offset,
      limit,
    });
    const totalPages = Math.ceil(count / limit);
    result.send({
      totalPages,
      currentPage: page,
      list: rows,
      count,
    });
  } catch (err) {
    result.status(500).send({
      message: "Some error occurred while retrieving data.",
    });
  }
};

/**
 *Retorna um objeto de pessoa pelo ID.
 * @param {Object} request.params.id; - O objeto de requisição HTTP contendo o ID do objeto a ser retornado.
 * @param {Object} result - O objeto de resposta HTTP.
 * @returns {Promise<void>} Um objeto de pessoa correspondente ao ID fornecido.
*/

exports.getPostByID = (request, result) => {
  const paramID = request.params.id;
  postObj
    .findAll({
      where: {
        id: paramID,
      },
    })
    .then((data) => {
      result.send(data);
    })
    .catch((err) => {
      result.status(500).send({
        message:
          err.message ||
          `Some error occurred while retrieving data with id `,
      });
    });
};

/**
  * Atualiza o objeto Post com base no ID fornecido na requisição.
  * Verifica se o CPF e e-mail já existem no banco de dados e atualiza o objeto Post se estiver tudo correto.
  * Retorna uma mensagem de sucesso ou erro ao atualizar o objeto.
  * @param {Object} request.params.id - O objeto de requisição HTTP contendo os dados do objeto Post a ser atualizado e o ID.
  * @param {Object} result - O objeto de resposta HTTP.
  * @returns {Promise<void>} Uma mensagem indicando se o objeto Post foi atualizado com sucesso ou não.
*/

exports.updatePostByID = async (request, result) => {
  const paramID = request.params.id;
  try {
    // Verificar se o CPF e o e-mail já existem no banco de dados
    const post = await postObj.findOne({
      where: {
        [Op.or]: [
          { cpf: request.body.cpf },
          { email: request.body.email }
        ]
      },
    });

    if (post && post.id != paramID) {
      // CPF ou e-mail já existem no banco de dados
      result.status(200).send({
        message: post.cpf == request.body.cpf ? "CPF" : "EMAIL",
      });
    } else {
      // CPF e e-mail não existem ou são do mesmo objeto que está sendo atualizado, atualizar o objeto Post no banco de dados
      const [num] = await postObj.update(request.body, {
        where: {
          id: paramID,
        },
      });

      if (num === 1) {
        result.send({
          message: "OK",
        });
      } else {
        result.send({
          message: `Cannot update Post object with id`,
        });
      }
    }
  } catch (err) {
    // Erro ao atualizar o objeto Post no banco de dados
    result.status(500).send({
      message: `Error while updating Post object with`,
    });
  }
};

/*
  * Esta função é responsável por deletar um objeto do tipo "pessoa" do banco de dados
  * com base no seu ID. Caso o objeto seja deletado com sucesso, a função retorna uma mensagem
  * "OK". Caso contrário, a função retorna uma mensagem de erro indicando que o objeto não 
  * pôde ser deletado.
*/
exports.deletePostByID = (request, result) => {
	const id = request.params.id;
	postObj.destroy({where: {	id } })
		.then((num) =>
			result.send({
				message: num === 1 ? "OK" : "ERROR",
			})
		)
		.catch((err) =>
			result.status(500).send({
				message: `Cannot delete Post object with id!`,
			})
		);
};

/**
 * Retorna uma lista de pessoas filtradas por uma string de busca, com paginação.
 * A pesquisa é feita nos campos 'nome', 'sobrenome', 'nacionalidade', 'cpf', 'email', 'telefone',
 * 'cep', 'logradouro', 'cidade' e 'estado'.
 * @param {Object} request.query.search - O objeto de requisição HTTP contendo os parâmetros da pesquisa.
 * @param {Object} result - O objeto de resposta HTTP.
 * @returns {Promise<void>} Uma lista de pessoas que correspondem à pesquisa, com metadados de paginação.
 * Por Jonatan Villela - jonatan.villela@gmail.com 
*/

exports.getSearch = async (request, result) => {
  try {
    const paramSearch = request.query.search;

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

    const page = parseInt(request.query._page) || 1;
    const limit = parseInt(request.query._limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await postObj.findAndCountAll({
      where,
      limit,
      offset
    });

    result.send({
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      list: rows,
      count
    });
  } catch (error) {
    result.status(500).send({
      message: "Something going wrong. Unable to retrieve data!"
    });
  }
};
