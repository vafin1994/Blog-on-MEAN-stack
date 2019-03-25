const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userData = require('./userdata');
const postRoutes = require("./routes/posts");

const app = express();
mongoose.connect('mongodb+srv://'+ userData.name + ':' + userData.password +'@cluster0-lhruj.mongodb.net/node-angular?retryWrites=true')
    .then(() => {
        console.log('Connected to DB!');
    })
    .catch(() => {
        console.log('Connection to DB failed!');
    });
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PATCH, DELETE, PUT');
    next();
});

app.use("/api/posts",postRoutes);

module.exports = app;
