require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const {port, baseUrl: hostname} = require('./config');
const webpush = require('web-push');

// const vapidKeys = webpush.generateVAPIDKeys();

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API',
            version: '1.0.0',
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

const swaggerSpec = swaggerJsdoc(options);
const setupOptions = {
  explorerUrl: true
}

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, setupOptions));

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

// webpush.setGCMAPIKey('GCM Api Key');
// webpush.setVapidDetails(
//     'mailto:karczinski.quentin@gmail.com',
//     vapidKeys.publicKey,
//     vapidKeys.privateKey,
// );

// const uniqueIdentifier = '';
// const pushSubscription = {
//     endpoint: `https://fcm.googleapis.com/fcm/send/${uniqueIdentifier}`,
//     keys: {
//         p256dh: 'zerzer',
//         auth: 'zerezr'
//     }
// }

// const pushOptions = {
//     vapidDetails: {
//         subject: 'mailto:karczinski.quentin@gmail.com',
//         publicKey: vapidKeys.publicKey,
//         privateKey: vapidKeys.privateKey,
//     },
//     TTL: 60
// }

const {DB_USERNAME, DB_PASSWORD, DB_TABLE} = process.env;
const dbUrl = `mongodb://${DB_USERNAME}:${DB_PASSWORD}@cluster0-shard-00-00.5yp3u.mongodb.net:27017,cluster0-shard-00-01.5yp3u.mongodb.net:27017,cluster0-shard-00-02.5yp3u.mongodb.net:27017/${DB_TABLE}?ssl=true&replicaSet=atlas-k3o6xi-shard-0&authSource=admin&retryWrites=true&w=majority`;

mongoose
    .connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log(`Connected on ${port} port !`);
        console.log(`You'll find SwaggerDoc at : http://localhost:4000/api-docs/#/`);
    })
    .catch((err) => {
        console.log("Not Connected to Database ERROR! ", err);
    });


const userRoutes = require('./routes/userRoutes');
userRoutes(app);
const partyRoutes = require('./routes/partyRoutes');
partyRoutes(app);
// const notificationRoutes = require('./routes/notificationRoutes');
// notificationRoutes(app);

process.setMaxListeners(0);
app.listen(port, hostname);

// webpush.sendNotification(pushSubscription, 'Test text', pushOptions);
