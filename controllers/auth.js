var mysql = require('mysql');
var dbconfig = require('../config/database');
var connection = mysql.createConnection(dbconfig.connection);
const bcrypt = require("bcryptjs");
const multer = require("multer");
const { query } = require('express');
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, "images");
    },
    filename: function (req, file, callback) {
      callback(null, req.params.id+".png");
    },
  });

let upload = multer({ storage: storage
    , fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "text") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png format allowed!'));
    }
  }}).any();

exports.register = async (req, res) => {


    const { first_name, last_name, email, password } = req.body

    connection.query(
        'SELECT email FROM users WHERE email=?', [email], async (error, results) => {
            if (error) {
                console.log(error)
            }

            if (results && results.length > 0) {
                return res.render('register', {
                    message: 'Email is already in use'
                })
            }
        }


    )
    
    let hashedPassword = await bcrypt.hash(password, 8);
    connection.query('INSERT INTO users SET ?', { firstName: first_name, lastName: last_name, email: email, password: hashedPassword }, (err, results) => {
        if (err) {
            console.log(err)
        } else {
            return res.render('register', {
                message: 'User Registered'
            })
        }
    })


}

exports.login = async (req, res) => {

    
    const { email, password } = req.body

    connection.query(
        'SELECT * FROM users WHERE email=?', [email], async (error, results) => {
            if (error) {
                console.log(error)
            }

            if ( ! results || results.length == 0) {
                return res.render('login', {
                    message: "Email doesn't exist please register before login"
                })
            }
            verfication = await bcrypt.compare(password ,results[0].password)
            if (!verfication ){
                return res.render('login', {
                    message: "Wrong Password"
                })
            }else{
                var randomNumber=Math.random().toString();
                randomNumber=randomNumber.substring(2,randomNumber.length);
                connection.query("UPDATE users SET _token =? WHERE id=?",[randomNumber,results[0].id])
                res.cookie("_token" ,randomNumber, { maxAge: 900000000, httpOnly: true })
                res.redirect('/users/' + results[0].id)
            }
            
        }

    )}

exports.edit = async (req, res) => {
   

    var cock = req.cookies["_token"]
    upload(req, res, function(err) {
        var {first_name, last_name} = req.body
        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        else if (!req.files) {
            connection.query(
                'SELECT * FROM users WHERE _token=?', [cock], async (error, results) => {
                    if (error) {
                        console.log(error)
                    }
                    first_name = (first_name) ? first_name:results[0].firstName 
                    last_name = (last_name) ? last_name:results[0].lastName
                    connection.query("UPDATE users SET firstName =?,lastName=? WHERE id=?",[first_name,last_name,results[0].id])
                    res.render("edit",{
                        edit_post_url:"/auth/edit/"+req.params.id,
                        image:"http://localhost:8000/images/"+results[0].picPath,
                        message:"Data Updated Successfully"})    
                })
                     
                return 
        }

        connection.query(
            'SELECT * FROM users WHERE _token=?', [cock], async (error, results) => {
                if (error) {
                    console.log(error)
                }
                first_name = (first_name) ? first_name:results[0].firstName 
                last_name = (last_name) ? last_name:results[0].lastName
                connection.query("UPDATE users SET firstName =?,lastName=?,picPath=? WHERE id=?",[first_name,last_name,results[0].id+".png",results[0].id])
                res.render("edit",{
                    edit_post_url:"/auth/edit/"+req.params.id,
                    image:"http://localhost:8000/images/"+results[0].picPath,
                    message:"Data Updated Successfully"    
            })
                 
        })

        return
    }
)}


