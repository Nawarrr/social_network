const express = require('express');
const router =  express.Router();
const authController = require('../controllers/auth')



// Register Form
router.post('/register' ,authController.register)

// Login
router.post('/login' ,authController.login)

//Edit Profile
router.post('/edit/:id' , authController.edit)

module.exports =router;
