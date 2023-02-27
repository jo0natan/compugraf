## API - Node.js / Express

- express: https://www.npmjs.com/package/express
- body-parser: https://www.npmjs.com/package/body-parser
- cors: https://www.npmjs.com/package/cors
- crypto: https://nodejs.org/api/crypto.html
- Sequelize: https://sequelize.org/

Por Jonatan Villela - jonatan.villela@gmail.com

A API segue o princípio SOLID, que é um conjunto de princípios de programação orientada a objetos que visam tornar o código mais legível, sustentável e fácil de manter. O SOLID é um acrônimo que representa cinco princípios: Single Responsibility Principle (Princípio da Responsabilidade Única), Open/Closed Principle (Princípio do Aberto/Fechado), Liskov Substitution Principle (Princípio da Substituição de Liskov), Interface Segregation Principle (Princípio da Segregação de Interfaces) e Dependency Inversion Principle (Princípio da Inversão de Dependência). O uso desses princípios ajuda a tornar o código da API mais modular, flexível e escalável.



Validação de requisição cliente e servidor

Isso significa que o cabeçalho de autorização é gerado com base em uma chave secreta compartilhada entre o aplicativo cliente e servidor. Se o middleware de validação de autorização estiver ativo, outros aplicativos não terão acesso ao Servidor. Somente o aplicativo com o autorizador tem acesso ao Servidor com a API.

Exemplo Headers de Autenção

```bash
jonatansec: Er6PHXyUwlzeWOb9cgkS6NkSEA+IZh5vgg==
timestamp: 1677538225783
```

Isso significa que o cabeçalho de autorização é gerado com base em uma chave secreta compartilhada entre o aplicativo cliente e servidor. Se o middleware de validação de autorização estiver ativo, outros aplicativos não terão acesso ao Servidor. Somente o aplicativo com o autorizador tem acesso ao Servidor com a API.

Somente a aplicação cliente tem acesso a API

 A chave secreta e a validade de cada requisição podem ser configuradas no arquivo .env, no caso abaixo cada requisição feita pelo Front tem a validade de 30 segundos.
 
```bash
ENCRYPTION_PASSWORD=JONATANSEC001254-VV
HEADER_VALIDITY=30
```




Tambem temos um middleware "cors" para validar um array de endereços de requisição do front-end. Ele permite que somente as requisições originadas a partir de um endereço especificado no array sejam processadas pelo servidor, enquanto outras requisições serão rejeitadas com um erro "unauthorized". Além disso, ele especifica quais métodos HTTP são permitidos para a requisição (GET, POST, PUT, DELETE) e expõe o cabeçalho "Authorization" na resposta. Esse middleware é adicionado à instância do servidor através do método "use" do express.

A configuração da array de endereços de origens permitidos para acesso ao Servidor pode ser configurado tambem no arquivo .env

```bash
ORIGIN_URL_CORS =http://localhost:8080,http://127.0.0.1:8080
```



Configuração de Banco de Dados .env

banco de dados MySQL usando Sequelize, um ORM (Object Relational Mapping) do Node.js.

DB_USERNAME: nome de usuário usado para acessar o banco de dados.
DB_PASSWORD: senha usada para acessar o banco de dados.
DB_DATABASE: nome do banco de dados que será usado.
DB_HOST: endereço do servidor de banco de dados.

DB_CONNECTION: especifica o tipo de banco de dados que está sendo usado.
As próximas variáveis ​​configuram as propriedades da conexão com o banco de dados:

DB_POOLMAX: é o número máximo de conexões que o pool de conexões pode fazer ao banco de dados.
DB_POOLMIN: é o número mínimo de conexões que o pool de conexões deve manter abertas.
DB_POOLACQUIRE: é o tempo máximo, em milissegundos, que o pool de conexões tentará adquirir uma nova conexão antes de gerar um erro.
DB_POOLIDLE: é o tempo máximo, em milissegundos, que uma conexão pode ficar inativa antes de ser encerrada pelo pool de conexões.

## Manual de rotas:

#### POST /api/posts/create

Descrição: cria uma nova pessoa no banco de dados
#### Body
- nome: string (obrigatório)
sobrenome: string (obrigatório)
nacionalidade: string (opcional)
cpf: string (obrigatório)
email: string (obrigatório)
telefone: string (opcional)
cep: string (opcional)
logradouro: string (opcional)
cidade: string (opcional)
estado: string (opcional)

#### Resposta:
Se a pessoa já existir, status 200 com mensagem no formato { message: "CPF" } ou { message: "EMAIL" } dependendo se o CPF ou email já existir no banco de dados
Se a pessoa for criada com sucesso, retorna um objeto com informações da nova pessoa

#### GET /api/posts/all

Descrição: retorna todas as pessoas cadastradas no banco de dados
#### Query parameters:
- _page: número da página (opcional, padrão é 1)
- _limit: número de objetos por página (opcional, padrão é 15)

#### Resposta:
totalPages: número total de páginas
currentPage: número da página atual
list: array com objetos de pessoas encontradas
count: número total de objetos encontrados

#### POST /api/posts/search

Descrição: retorna uma lista de pessoas que correspondem à pesquisa
#### Query parameters:
 - search: termo de pesquisa (opcional)
_page: número da página (opcional, padrão é 1)
_limit: número de objetos por página (opcional, padrão é 10)

#### Resposta:
totalPages: número total de páginas
currentPage: número da página atual
- list: array com objetos de pessoas encontradas
count: número total de objetos encontrados

#### PUT /api/post/update/:id

Descrição: atualiza as informações de uma pessoa existente no banco de dados
Parâmetros:
- id: identificador único da pessoa (obrigatório)
#### Body:
- nome: string (opcional)
sobrenome: string (opcional)
nacionalidade: string (opcional)
cpf: string (opcional)
email: string (opcional)
telefone: string (opcional)
cep: string (opcional)
logradouro: string (opcional)
cidade: string (opcional)
estado: string (opcional)
#### Resposta:
Se o CPF ou e-mail já existir no banco de dados, status 200 com mensagem no formato { message: "CPF" } ou { message: "EMAIL" } dependendo se o CPF ou email já existir no banco de dados
Se a pessoa for atualizada com sucesso, status 200 com mensagem no formato { message: "OK" }
Se ocorrer um erro ao atualizar a pessoa, status 500 com mensagem de erro
#### DELETE /api/post/delete/:id

Descrição: remove uma pessoa existente no banco de dados
Parâmetros:
- id: identificador único da pessoa (obrigatório)
#### Resposta:
Se a pessoa for removida com sucesso, status 200 com mensagem no formato { message: "OK" }
Se ocorrer um erro ao remover a pessoa, status 500 com mensagem de erro


## Project setup

```bash
npm install
```

### Start de desenvolvimento

```bash
npm run dev
```

### Start de produção

```bash
npm run start
```

Por Jonatan Villela - jonatan.villela@gmail.com
