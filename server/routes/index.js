
const express = require("express");
const router = express.Router();
const PessoaService = require('../services/PessoaService');
const PessoaRepository = require('../repositories/PessoaRepository');
const PessoaController = require('../controllers/PessoaController');

// Cria uma instância do repositório
const pessoaRepository = new PessoaRepository();

// Cria uma instância do serviço, passando o repositório como dependência
const pessoaService = new PessoaService(pessoaRepository);

// Cria uma instância do controlador, passando o serviço como dependência
const pessoaController = new PessoaController(pessoaService);


// Criação de um novo post:
// Esta rota é responsável por criar um novo post no sistema. Ela recebe uma requisição HTTP com as informações do post a ser criado e utiliza a função create do arquivo post.js para inserir os dados no banco de dados. Caso a inserção seja bem sucedida, a rota retorna uma resposta HTTP com o novo post criado e status 200. Caso contrário, retorna uma mensagem de erro com status 500.
router.post("/api/posts/create", pessoaController.create.bind(pessoaController));


// Recuperação de todos os posts:
// Esta rota é responsável por recuperar todos os posts cadastrados no sistema. Ela recebe uma requisição HTTP e utiliza a função getAllPosts do arquivo post.js para buscar os dados no banco de dados. Caso a busca seja bem sucedida, a rota retorna uma resposta HTTP com os posts encontrados e status 200. Caso contrário, retorna uma mensagem de erro com status 500.
router.get("/api/posts/all", pessoaController.getAllPessoas.bind(pessoaController));


// Pesquisa nos campos de todos os parametros:
// Esta rota é responsável por realizar uma pesquisa nos campos de todos os parâmetros dos posts cadastrados no sistema. Ela recebe uma requisição HTTP com um termo de pesquisa e utiliza a função getSearch do arquivo post.js para buscar os dados no banco de dados. Caso a busca seja bem sucedida, a rota retorna uma resposta HTTP com os posts encontrados e status 200. Caso contrário, retorna uma mensagem de erro com status 500.
router.post("/api/posts/search", pessoaController.getSearch.bind(pessoaController));


// Atualização de um post pelo ID:
// Esta rota é responsável por atualizar um post específico do sistema, identificado pelo seu ID. Ela recebe uma requisição HTTP com o ID do post a ser atualizado e os dados atualizados e utiliza a função updatePostByID do arquivo post.js para atualizar os dados no banco de dados. Caso a atualização seja bem sucedida, a rota retorna uma resposta HTTP com status 200. Caso contrário, retorna uma mensagem de erro com status 500.
router.put("/api/post/update/:id", pessoaController.updatePostByID.bind(pessoaController));


// Exclusão de um post pelo ID:
// Esta rota é responsável por excluir um post específico do sistema, identificado pelo seu ID. Ela recebe uma requisição HTTP com o ID do post a ser excluído e utiliza a função deletePostByID do arquivo post.js para remover os dados do banco de dados. Caso a exclusão seja bem sucedida, a rota retorna uma resposta HTTP com status 200. Caso contrário, retorna uma mensagem de erro com o status 500.
router.delete("/api/post/delete/:id", pessoaController.deletePostByID.bind(pessoaController));

module.exports = router;
