const express = require('express');
var mysql = require('mysql');
var dbconfig = require('../config/database');
const router =  express.Router();
var connection = mysql.createConnection(dbconfig.connection);

// Home Page
router.get('/' , (req,res)=> {
    var cock = req.cookies["_token"]
    connection.query(
        'SELECT id,_token FROM users WHERE _token=?', [cock], async (error, results) => {
            if (error) {
                console.log(error)
            }

            if ( ! results || results.length == 0) {
                res.render('index');
            }            
            else if (results[0]._token == cock) {
                res.redirect('/users/' + results[0].id)
            }
        })
})

// Register Page
router.get('/register' , (req,res)=> {
    res.render('register');
})

// Login Page
router.get('/login' , (req,res)=> {
    res.render('login');
})

//Logout 
router.get('/logout' , (req,res)=> {
    var cock = req.cookies["_token"]
    connection.query("UPDATE users SET _token =? WHERE _token=?",[null,cock])
    res.redirect('/')
})

//Profile HomePage
router.get('/users/:id', function(req, res) {
    var cock = req.cookies["_token"]
    connection.query(
        'SELECT * FROM users WHERE id=?', [req.params.id], async (error, results) => {
            if (error) {
                console.log(error)
            }            
            if ( ! results || results.length == 0) {
                res.render('profile_home');
            }
            else if (results[0]._token == cock) {
                res.render('profile_home_owner',{id:req.params.id,image:"http://localhost:8000/images/"+results[0].picPath,friReq:results[0].reqNum})
            }
            else{
                res.render('profile_home')
            }
        })
  });

// Requests Page #TODO
router.get('/req/:id', function(req, res) {
    var cock = req.cookies["_token"]
    var first_res 
    connection.query(
        'SELECT * FROM users WHERE id=?', [req.params.id], async (error, results) => {
            if (error) {
                console.log(error)
            }            
            if ( ! results || results.length == 0) {
                res.render('/');
                return
            }
            else if (results[0]._token == cock) {
                first_res = results
            }
            else{
                res.render('/')
                return
            }
        })
    connection.query(
        'SELECT * FROM users WHERE id=?'
    )
});

//Profile EditPage
router.get('/users/:id/edit', function(req, res) {
    var cock = req.cookies["_token"]
    connection.query(
        'SELECT * FROM users WHERE id=?', [req.params.id], async (error, results) => {            
            if ( ! results || results.length == 0) {
                res.redirect('/users/'+req.params.id)
            }
            else if (results[0]._token == cock) {
                res.render('edit',{edit_post_url:"/auth/edit/"+req.params.id,image:"http://localhost:8000/images/"+results[0].picPath,friReq:results[0].reqNum})
            }
            else{
                res.redirect('/users/'+req.params.id)
            }
        })
  });

//Search Page
router.get('/search', function(req, res) {
    var cock = req.cookies["_token"]
    var sr = req.query.query
    connection.query(
        'SELECT * FROM users\
        WHERE  email = \''+sr+'\'  OR firstName LIKE \'%'+sr+'%\' or lastName LIKE \'%'+sr+'%\'', async (error, results) => { 
            var  search_res = results
            connection.query(
                'SELECT * FROM users WHERE _token=?', [cock], async (error, results) => {            
                    if ( ! results || results.length == 0) {
                        res.redirect("/")
                    }
                    else{
                        res.render("search_logged_in",{edit_post_url:"/auth/edit/"+req.params.id,image:"http://localhost:8000/images/"+results[0].picPath,result:search_res,id:req.params.id})
                    }
                })  
        })
  });

module.exports =router;
