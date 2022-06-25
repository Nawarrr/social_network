const express = require('express');
const router =  express.Router();



const postController = require('../controllers/users')

// Post Post
router.post('/post/:id' , postController.post)


module.exports =router;
