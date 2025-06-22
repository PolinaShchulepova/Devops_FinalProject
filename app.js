const express = require('express');
const app = express();
const eventRoutes = require('./routes/events');
require('dotenv').config();


app.use(express.json());


app.use('/', eventRoutes);


//app.get('/cicd-test', (req, res) => {
// res.send('CI/CD Pipeline Working!');
//});

module.exports = app;

