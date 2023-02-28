## Manual do Docker Compose


Containers

- mysql - serviço de banco de dados MySQL
- phpmyadmin - serviço que fornece uma interface web para gerenciar o banco de dados MySQL
- web - serviço que contém um aplicativo cliente Crud em Vue3.js
- app - serviço que contém api em Express com Sequelize em Node.js

Cada serviço é definido por uma seção no arquivo de composição do Docker e possui sua própria imagem Docker. As seções de serviço incluem informações sobre as variáveis de ambiente, portas expostas, volumes compartilhados e comandos de inicialização.

comando para inicialização da aplicação:
```sh
docker-compose up -d
```

Após a inicialização de todos os containers, é necessário aguardar pelo menos 30 segundos para que a API inicie corretamente. Isso ocorre porque a API depende do container MySQL para criar o banco de dados e as tabelas necessárias para seu funcionamento adequado. Portanto, certifique-se de esperar pelo menos 30 segundos antes de iniciar o uso da API.

Para mais detalhes da instalção do Docker Compose veja abaixo no link:
https://docs.docker.com/compose/install/


Para usar o projeto:

  1º Passo
```sh
git clone https://github.com/jo0natan/compugraf.git
```

2º Passo
```sh
cd compugraf
```

3º Passo
```sh
docker-compose up -d
```

Endereço de Acesso ao Aplicativo: [http://localhost:8080](http://localhost:8080/)

Endereço da API: [http://localhost:8000](http://localhost:8000/)

Endereço do phpMyAdmin: [http://localhost:8183/](http://localhost:8183/)

Para acessar o banco de dados, deixe o campo "servidor" em branco e utilize as credenciais citadas no arquivo .env.

O manual do servidor e do cliente pode ser encontrado no arquivo readme.md dentro de suas respectivas pastas.

Por Jonatan Villela - jonatan.villela@gmail.com
