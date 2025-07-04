const express = require('express');
const app = express();
const mongoose = require('mongoose');
const eventRoutes = require('./routes/events');
require('dotenv').config();
const Event = require('./models/schema');
const client = require('prom-client'); 


const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics(); 

const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests received',
});

const eventsCountGauge = new client.Gauge({
  name: 'total_events_in_db',
  help: 'Current number of events in the database'
});
app.use((req, res, next) => {
  httpRequestCounter.inc();
  next();
});

app.get('/metrics', async (req, res) => {
    try {
    const count = await Event.countDocuments();
    console.log('Total events in DB:', count);
    eventsCountGauge.set(count); 

    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
  } catch (err) {
    res.status(500).end(err.toString());
  }
});


app.use(express.json());


app.use('/', eventRoutes);


app.get('/cicd-test', (req, res) => {
  res.send('CI/CD Pipeline Working!');
});

module.exports = app;

