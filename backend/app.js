const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./models/post');

const app = express();
mongoose.connect('mongodb+srv://OleksandrVafin:YWboBMLzT9qZnpQZ@cluster0-lhruj.mongodb.net/node-angular?retryWrites=true')
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
// Get List of posts
app.get('/api/posts', (req, res, next) => {
    Post.find()
        .then(documents => {
            console.log(documents);
            res.status(200).json({
                message: 'Success',
                posts: documents,
            });
        });
});
// Create new post
app.post("/api/posts", (req, res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
    });
    post.save().then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Success',
            id: result._id,
        });
    });
});
// Update post
app.put("/api/posts/:id", (req, res, next) =>{
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
    });
    Post.updateOne({_id: req.params.id}, post).then(
        result =>{
            console.log(result);
            res.status(200).json({message: 'Update successful'});
        }
    )
});
// Delete post
app.delete('/api/posts/:id', (req, res, next)=>{
    Post.deleteOne({_id: req.params.id})
        .then(result => {
            console.log(result);
            res.status(200).json({message: 'Post deleted'});
        });
});

module.exports = app;