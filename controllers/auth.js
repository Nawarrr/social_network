var mysql = require('mysql');
var dbconfig = require('../config/database');
var connection = mysql.createConnection(dbconfig.connection);
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


exports.register = async (req, res) => {
    console.log(req.body)


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
    console.log(req.body)

    
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
                res.cookie("_token" ,randomNumber, { maxAge: 900000, httpOnly: true })
                res.redirect('/users/' + results[0].id)
            }
            
        }

    )}