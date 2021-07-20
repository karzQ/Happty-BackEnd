require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const server = express();

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Config to avoid mongoose deprecations warnings
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
//

const hostname = "127.0.0.1";
const port = process.env.PORT || 4000;
const DB_TABLE = process.env.DB_TABLE;

/**
 * Remote DB access credentials
 */
const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const remote_uri = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@clusterdb.usmas.azure.mongodb.net/${DB_TABLE}?retryWrites=true&w=majority`;

/**
 * Connect Back-end application to MongoDB Database
 * DbName = "db-nodeproject"
 */
mongoose
  // Connect to DB in remote
  .connect(remote_uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log(`Connected on ${port} port !`);
    console.log(`----`);
    console.log(`If needed, you'll find Swagger-UI API Docs at this url :`)
    console.log(`http://localhost:4000/api-docs/#/`)
  })
  .catch((err) => {
    console.log("Not Connected to Database ERROR! ", err);
  });

const userRoute = require("./api/routes/userRoute");
userRoute(server);

server.listen(port, hostname);