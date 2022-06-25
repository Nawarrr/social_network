var mysql      = require('mysql');
var dbconfig = require('../config/database');

var connection = mysql.createConnection(dbconfig.connection)


//connection.query('CREATE DATABASE ' + dbconfig.database);
connection.query('\
CREATE TABLE `' + dbconfig.database + '`.`' + dbconfig.users_table + '` ( \
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    `firstName` VARCHAR(20) NOT NULL, \
    `lastName` VARCHAR(20) NOT NULL, \
    `email` VARCHAR(50) NOT NULL, \
    `password` VARCHAR(1024) NOT NULL, \
    `picPath` VARCHAR(1024) NOT NULL DEFAULT "default.png", \
    `_token` TEXT , \
    `reqNum` INT DEFAULT 0 , \
        PRIMARY KEY (`id`), \
    UNIQUE INDEX `id_UNIQUE` (`id` ASC) \
)');

connection.end();