var mysql = require('mysql');
var dbconfig = require('../config/database');
const { connect } = require('../routes/auth');
var connection = mysql.createConnection(dbconfig.connection);



exports.post = (req, res) => {
    var cock = req.cookies["_token"]
    connection.query('SELECT id from users WHERE `_token` = ?' , [cock], (error,results) => {
        if (error){
            console.log(error)
        }else  if ( ! results || results.length == 0) {
            res.redirect("/");
        }
        else {
           
            const date = new Date()
            connection.query('INSERT INTO posts SET ?', { user_id : results[0].id, body : req.body.text , published_on :date })
            res.redirect('back');
        }

        
        

    })

    
    
 
 
}