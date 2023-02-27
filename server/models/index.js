const dbConfig = require("../config/db.config");
const {
    Sequelize
} = require('sequelize');

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
db.posts = require("./Sequelize.model")(database, Sequelize);
module.exports = db;
