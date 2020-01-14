const express = require('express');
const mongoose = require('mongoose')
const routes = require('../src/routes.js');

const app = express();

mongoose.connect('mongodb+srv://omnistack:omnistack2020@cluster0-jyuk5.mongodb.net/week10?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

app.use(express.json());
app.use(routes);

app.listen(3333);