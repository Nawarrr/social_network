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
    connection.query("UPDATE users SET _token =? WHERE _token=?",["",cock])
    res.redirect('/')
})

// Friends Page
router.get('/friends' , (req,res)=> {
    var cock = req.cookies["_token"]
    var first_res
    connection.query(
        'SELECT * FROM users WHERE _token=?', [cock], async (error, results) => {
            if (error) {
                console.log(error)
            }            
            if ( ! results || results.length == 0) {
                res.redirect('/');
                return
            }
            first_res = results
            connection.query(
                'SELECT * FROM users u,friends fr where u.id=fr.friend_id and fr.user_id=?',[first_res[0].id], async (error, results) => {
                    if (error) {
                        console.log(error)
                        res.redirect('/');
                        return
                    }            
                    
                    res.render("friends",{name:first_res[0].firstName+", "+first_res[0].lastName,result : results,image:first_res[0].picPath})
                })
        })
})


//Profile HomePage
router.get('/users/:id', function(req, res) {
    var cock = req.cookies["_token"]
    var first_res
    connection.query(
        'SELECT * FROM users WHERE id=?', [req.params.id], async (error, results) => {
            if (error) {
                console.log(error)
                return
            }
            if ( ! results || results.length == 0) {
                res.redirect("/")
                return 
            }
            first_res = results
            connection.query('SELECT * FROM posts WHERE user_id=?' , [req.params.id], (error, results) =>{
                if (error){
                    console.log(error);
                    return;
                }
                
            var posts_obj = results
            if (first_res[0]._token == cock) {  
                res.render('profile_home_owner',{id:first_res[0].id,name:first_res[0].firstName+", "+first_res[0].lastName,image:"http://localhost:8000/images/"+first_res[0].picPath,friReq:first_res[0].reqNum,
                                               post_url : "/users"+"/post/" +req.params.id , posts : posts_obj })}
                
            else if(cock){
                
                connection.query(
                    'SELECT id FROM users WHERE _token=?', [cock], async (error, results) => {
                        if (error) {
                            console.log(error)
                            return
                        }if ( ! results || results.length == 0){

                            res.render('profile_home', {id:first_res[0].id,friends:0,name:first_res[0].firstName+", "+first_res[0].lastName,posts : posts_obj,image:"http://localhost:8000/images/"+first_res[0].picPath})
                        }
                        
                        
                        
                connection.query(
                    'SELECT * FROM friends where friend_id=? and user_id=?',[first_res[0].id,results[0].id], async (error, results) => {
                        if (error) {
                            console.log(error)
                            res.redirect('/');
                            return
                        }

                        var friends
                        if(results.length)friends=1
                        else friends=0           
                        res.render('profile_home', {id:first_res[0].id,friends:results,name:first_res[0].firstName+", "+first_res[0].lastName,posts : posts_obj,image:"http://localhost:8000/images/"+first_res[0].picPath})
            
                    })
                })
                }else{
                    res.render('profile_home', {id:first_res[0].id,friends:0,name:first_res[0].firstName+", "+first_res[0].lastName,posts : posts_obj,image:"http://localhost:8000/images/"+first_res[0].picPath})

                }
        })
    })
  });

// Requests Page
router.get('/req/:id', function(req, res) {
    var cock = req.cookies["_token"]
    var first_res 
    connection.query(
        'SELECT * FROM users WHERE id=?', [req.params.id], async (error, results) => {
            if (error) {
                console.log(error)
            }            
            if ( ! results || results.length == 0) {
                res.redirect('/');
                return
            }
            else if (results[0]._token == cock) {
                first_res = results
                connection.query(
                    'SELECT * FROM users u,friend_reqs fr where u.id=sender_id and fr.id='+first_res[0].id, async (error, results) => {
                        if (error) {
                            console.log(error)
                            return
                        } 
                        
                        res.render("friends_req",{name:first_res[0].firstName+", "+first_res[0].lastName,result : results,image:first_res[0].picPath})
                        })
            }
            else{
                res.redirect('/')
                return
            }
        })
});

// accept friend request
router.get('/accept/:id', function(req, res) {
    var cock = req.cookies["_token"]
    connection.query(
        'SELECT * FROM users WHERE _token=?', [cock], async (error, results) => {
            if (error) {
                console.log(error)
            }            
            if ( ! results || results.length == 0) {
                res.redirect('/');
                return
            }
            connection.query("UPDATE users SET reqNum = reqNum - 1 WHERE id=?",[results[0].id])
            connection.query("delete from friend_reqs where id=? and sender_id=?",[results[0].id,req.params.id])
            connection.query("insert into friends (user_id,friend_id) values (?,?)",[req.params.id,results[0].id])
            connection.query("insert into friends (user_id,friend_id) values (?,?)",[results[0].id,req.params.id,])
            res.redirect("/req/"+results[0].id)        
        })
});


// Send friend Req
router.get('/send/:id', function(req, res) {
    var cock = req.cookies["_token"]
    connection.query(
        'SELECT * FROM users WHERE _token=?', [cock], async (error, results) => {
            if (error) {
                console.log(error)
            }            
            if ( ! results || results.length == 0) {
                res.redirect('/')
                return
            }
            else if (results[0]._token == cock) {
                connection.query("insert ignore into friend_reqs (id,sender_id) values (?,?)",[req.params.id,results[0].id])
                connection.query("UPDATE users SET reqNum =reqNum + 1 WHERE id=?",[req.params.id])
                res.redirect('/')
        }
    })
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
                res.render('edit',{name:results[0].firstName+", "+results[0].lastName,edit_post_url:"/auth/edit/"+req.params.id,
                                    image:"http://localhost:8000/images/"+results[0].picPath,friReq:results[0].reqNum,id:req.params.id})
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
                        res.render("search_logged_in",{name:results[0].firstName+", "+results[0].lastName,edit_post_url:"/auth/edit/"+req.params.id,image:"http://localhost:8000/images/"+results[0].picPath,result:search_res,id:req.params.id})
                    }
                })  
        })
  });


module.exports =router;
