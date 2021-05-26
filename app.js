const express = require('express');
const bodyParser = require('body-parser');
const database = require('./models/database');

const userRoutes = require('./routes/products-routes');

const app = express();

const con = new database({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'order_app'
});

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());

app.use('/api/v1/product', userRoutes);


module.exports = app;
global.db = con;