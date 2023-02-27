
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const server = express();
const db = require("./models");
require('dotenv').config();



const AuthorizationValidator = require('./models/jonatanSec');
const authorizationValidator = new AuthorizationValidator(process.env.ENCRYPTION_PASSWORD, process.env.HEADER_VALIDITY);

const api = require("./routes/index");
server.disable("x-powered-by");

// Middleware que valida um array de endereços da requisição do front
const corsSettings = {
  origin: (origin, callback) => {
    const allowedOrigins = process.env.ORIGIN_URL_CORS.split(",");
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      throw new Error("unauthorized");
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  exposedHeaders: ["Authorization"],
};

server.use(cors(corsSettings));

// Middleware que valida a autorização de uma requisição --- Por Jonatan Villela - jonatan.villela@gmail.com
server.use(async (req, res, next) => {
    try {
      const headers = await authorizationValidator.extractHeaders(req);
      await authorizationValidator.validate(headers);
      next();
    } catch (error) {
      return res.status(400).send({ message: error.message });
    }
});

server.use((req, res, next) => {
    bodyParser.json()(req, res, (err) => {
        if (err) {
            //console.error(err);
            return res.status(400).send({
                message: "JSON",
            });
        }
        next();
    });
});


// Parse request of content-type - application/json
server.use(bodyParser.json());
// parse requests of content-type -application/x-www-form-urlencoded
server.use(bodyParser.urlencoded({
    extended: true
}));

server.use("/", api);
// set listening ports for request
const port = process.env.PORT || 8083;

server.listen(port, () => {
    console.log(`Server running on port : ${port}`);
});
// Run following function if you want drop existing tables and re-sync database
// db.dropRestApiTable();
db.databaseConf.sync();