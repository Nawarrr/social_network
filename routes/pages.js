const express = require('express');
var mysql = require('mysql');
var dbconfig = require('../config/database');
const router =  express.Router();
var connection = mysql.createConnection(dbconfig.connection);


// Home Page
router.get('/' , (req,res)=> {

    res.render('index');
})

// Register Page
router.get('/register' , (req,res)=> {
    res.render('register');
})

// Login Page
router.get('/login' , (req,res)=> {
    res.render('login');
})

//Profile HomePage
router.get('/users/:id', function(req, res) {
    var cock = req.cookies["_token"]
    connection.query(
        'SELECT _token FROM users WHERE id=?', [req.params.id], async (error, results) => {
            if (error) {
                console.log(error)
            }
            if (results[0]._token == cock) {
                res.render('profile_home_owner')
            }
            else{
                res.render('profile_home')
            }
        })
  });

module.exports =router;
