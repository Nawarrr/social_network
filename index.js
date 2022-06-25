const express = require('express');
var mysql= require('mysql');
const path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser =	require("body-parser");
// initializing express
const app = express();

app.use(cookieParser());


// db configuration for connection
var dbconfig = require('./config/database');
var db = mysql.createConnection(dbconfig.connection);

// DB connection
db.connect((err)=> {
    if(err){
        console.log(err)
    }else {
        console.log("MySQL connected...")
    }
})

// static files 
const publicDirectory = path.join(__dirname , './public');
app.use(express.static(publicDirectory));
// Parse Form Data
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.set('view engine', 'hbs');




// app on port 8000
app.listen('8000', () => {
    console.log('Server on port 8000')
});


// Routes

app.use('/',require('./routes/pages'));
app.use('/auth',require('./routes/auth'));
app.use('/users' , require('./routes/users'))
