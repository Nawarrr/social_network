const express = require('express');
const router =  express.Router();
const authController = require('../controllers/auth')


const postController = require('../controllers/users')
// Register Form
router.post('/register' ,authController.register)

// Login
router.post('/login' ,authController.login)

//Edit Profile
router.post('/edit/:id' , authController.edit)


// Post Post
router.post('/post/:id' , postController.post)


module.exports =router;
