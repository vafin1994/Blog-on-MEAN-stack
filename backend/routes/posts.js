/* tslint:disable:quotemark */
const express = require("express");
const Post = require('../models/post');
const multer = require('multer');
const router = express.Router();

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
};
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error('Invalid Mime Type');
        if (isValid) {
            error = null;
        }
        callback(error, "backend/images");
    },
    filename: (req, file, callback) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        callback(null, name + '-' + Date.now() + '.' + ext);
    },
});

// Get List of posts
router.get('', (req, res, next) => {
    Post.find()
        .then(documents => {
            res.status(200).json({
                message: 'Success',
                posts: documents,
            });
        });
});
//Get post
router.get('/:id', (req, res, next) => {
    Post.findById(req.params.id).then(post => {
        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({message: 'Post not found'});
        }
    });
});
// Create new post
router.post("", multer({storage: storage}).single("image"), (req, res, next) => {
    const url = req.protocol + '://' + req.get("host");
    const post = new Post({
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename,
        title: req.body.title,
    });
    post.save().then(result => {
        res.status(201).json({
            message: 'Success',
            post: {
                content: result.content,
                id: result._id,
                imagePath: result.imagePath,
                title: result.title,
            },
        });
    });
});
// Update post
router.put("/:id", multer({storage: storage}).single("image"), (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
        const url = req.protocol + "://" + req.get("host");
        imagePath = url + "/images/" + req.file.filename;
    }
    const post = new Post({
        _id: req.body.id,
        content: req.body.content,
        title: req.body.title,
    });
    Post.updateOne({_id: req.params.id}, post).then(
        result => {
            res.status(200).json({message: 'Update successful'});
        });
});
// Delete post
router.delete('/:id', (req, res, next) => {
    Post.deleteOne({_id: req.params.id})
        .then(result => {
            console.log(result);
            res.status(200).json({message: 'Post deleted'});
        });
});

module.exports = router;
