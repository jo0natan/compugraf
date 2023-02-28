require('dotenv').config()

module.exports = {
    HOST: process.env.DB_HOST,
    USER: process.env.DB_USERNAME,
    PASSWORD: process.env.DB_PASSWORD,
    DB: process.env.DB_DATABASE,
    dialect: process.env.DB_CONNECTION,
    pool: {
        max:  parseInt(process.env.DB_POOLMAX),
        min: parseInt(process.env.DB_POOLMAX),
        acquire:parseInt(process.env.DB_POOLACQUIRE),
        idle: parseInt(process.env.DB_POOLIDLE)
    }
};
