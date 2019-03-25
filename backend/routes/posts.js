const express = require("express");
const Post = require('../models/post');
const router = express.Router();


// Get List of posts
router.get('/api/posts', (req, res, next) => {
    Post.find()
        .then(documents => {
            console.log(documents);
            res.status(200).json({
                message: 'Success',
                posts: documents,
            });
        });
});
//Get post
router.get('/api/post/:id', (req, res, next) => {
    Post.findById(req.params.id).then(post => {
        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({message: 'Post not found'})
        }
    })
});
// Create new post
router.post("/api/posts", (req, res, next) => {
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
router.put("/api/posts/:id", (req, res, next) => {
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
    });
    Post.updateOne({_id: req.params.id}, post).then(
        result => {
            res.status(200).json({message: 'Update successful'});
        }
    )
});
// Delete post
router.delete('/api/posts/:id', (req, res, next) => {
    Post.deleteOne({_id: req.params.id})
        .then(result => {
            console.log(result);
            res.status(200).json({message: 'Post deleted'});
        });
});

module.exports = router;
