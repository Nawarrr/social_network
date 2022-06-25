const express = require('express');
var mysql = require('mysql');
var dbconfig = require('../config/database');
const { post } = require('./auth');
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
    var first_res
    connection.query(
        'SELECT _token FROM users WHERE id=?', [req.params.id], async (error, results) => {
            if (error) {
                console.log(error)
                return
            }
            first_res = results})
            connection.query('SELECT * FROM posts WHERE user_id=?' , [req.params.id], (error, results) =>{
                if (error){
                    console.log(error);
                    return;
                }
            var posts_obj = results
                

                        
            
            if ( ! first_res || first_res.length == 0) {
                res.render('profile_home' ,  {posts : posts_obj})
            } else if (first_res[0]._token == cock) {
                res.render('profile_home_owner',{edit_url:"/users/"+req.params.id+"/edit" , post_url : "/users"+"/post/" +req.params.id , posts : posts_obj })
            }
            else{
                res.render('profile_home', {posts : posts_obj})
            }

        

        })
        
  });

//Profile EditPage
router.get('/users/:id/edit', function(req, res) {
    var cock = req.cookies["_token"]
    connection.query(
        'SELECT _token FROM users WHERE id=?', [req.params.id], async (error, results) => {            
            if ( ! results || results.length == 0) {
                res.redirect('/users/'+req.params.id)
            }
            else if (results[0]._token == cock) {
                res.render('edit',{edit_post_url:"/auth/edit/"+req.params.id})
            }
            else{
                res.redirect('/users/'+req.params.id)
            }
        })
  });

//   router.get('/users/:id' , (req,res)=> {
//       var cock = req.cookies["_token"]
//       connection.query(

//       )
//   })

module.exports =router;
