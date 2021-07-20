require('dotenv').config();
<<<<<<< HEAD
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
=======
const express = require("express");
const mongoose = require("mongoose");
const server = express();

>>>>>>> d4474913c99bf11fc4e0b9b79b08ff64a4a75d8a
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API',
            version: '1.0.0',
        },
        servers: {
            url: 'http://localhost:4000'
        },
        tags: [
            {
                name: 'Users',
                description: 'Application users',
            },
            {
                name: 'Parties',
                description: 'Users parties',
            },
            {
                name: 'Notifications',
                description: 'Users notifications',
            },
        ],
    },
    apis: ['./routes/*.js'], // files containing annotations as above
};

<<<<<<< HEAD
const swaggerSpec = swaggerJsdoc(options);
const setupOptions = {
    explorerUrl: true
}

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, setupOptions));
=======
server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
>>>>>>> d4474913c99bf11fc4e0b9b79b08ff64a4a75d8a

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const {port, baseUrl: hostname} = require('./config');
const {DB_USERNAME, DB_PASSWORD, DB_TABLE} = process.env;
const dbUrl = `mongodb://${DB_USERNAME}:${DB_PASSWORD}@cluster0-shard-00-00.5yp3u.mongodb.net:27017,cluster0-shard-00-01.5yp3u.mongodb.net:27017,cluster0-shard-00-02.5yp3u.mongodb.net:27017/${DB_TABLE}?ssl=true&replicaSet=atlas-k3o6xi-shard-0&authSource=admin&retryWrites=true&w=majority`;

mongoose
<<<<<<< HEAD
    .connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log(`Connected on ${port} port !`);
    })
    .catch((err) => {
        console.log("Not Connected to Database ERROR! ", err);
    });


const animalRoutes = require('./routes/animalRoutes');
animalRoutes(app);
const userRoutes = require('./routes/userRoutes');
userRoutes(app);
const articleRoutes = require('./routes/articleRoutes');
articleRoutes(app);
const donationRoutes = require('./routes/donationRoutes');
donationRoutes(app);
const productRoutes = require('./routes/productRoutes');
productRoutes(app);

process.setMaxListeners(0);
app.listen(port, hostname);
=======
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
>>>>>>> d4474913c99bf11fc4e0b9b79b08ff64a4a75d8a
