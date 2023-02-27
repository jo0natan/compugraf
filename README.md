## Manual do Docker Compose

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

Por Jonatan Villela - jonatan.villela@gmail.com
