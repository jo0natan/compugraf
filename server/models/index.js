const dbConfig = require("../config/db.config");
const { Sequelize } = require('sequelize');
const RestCompugraf = require('./RestCompugraf');

const database = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    logging: process.env.NODE_ENV === 'production' ? false : console.log, // ativa ou desativa o logging com base em NODE_ENV
    define: {
        underscored: true,
        debug: process.env.NODE_ENV !== 'production'
    },
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

const db = {};
db.Sequelize = Sequelize;
db.databaseConf = database;
// function to drop existing tables and re-sync database
db.dropRestApiTable = () => {
    db.databaseConf.sync({
        force: true
    }).then(() => {
        console.log("reiniciando tabela...........");
    });
};
db.restCompugraf = new RestCompugraf(database).model;
module.exports = db;


/*
 * outros métodos de uso

        /// create
        const novoRestCompugraf = await RestCompugraf.model.create({
            nome: "João",
            sobrenome: "Silva",
            nacionalidade: "Brasileiro",
            cpf: "111.111.111-11",
            cep: "12345-678",
            estado: "SP",
            cidade: "São Paulo",
            logradouro: "Av. Paulista, 123",
            email: "joao@example.com",
            telefone: "(11) 99999-9999",
        });


        /// update
        restCompugraf.model.update(
        {
            nome: 'Maria',
            sobrenome: 'Souza',
            nacionalidade: 'Brasileira',
            email: 'maria.souza@example.com',
            telefone: '(11) 5555-5555',
        },
        {
            where: {
            cpf: '123.456.789-10',
            },
        },
        ).then((updatedRows) => {
        console.log('Registros atualizados:', updatedRows);
        }).catch((err) => {
        console.error('Erro ao atualizar registros:', err);
        });


        ///delete where
        await restCompugraf.model.destroy({
        where: {
            cpf: '123.456.789-10',
        },
        });

*/