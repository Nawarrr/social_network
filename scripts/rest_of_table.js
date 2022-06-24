var mysql      = require('mysql');
var dbconfig = require('../config/database');

var connection = mysql.createConnection(dbconfig.connection)



connection.query('\
CREATE TABLE `' + dbconfig.database + '`.`' + dbconfig.posts_table + '` ( \
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    `user_email` VARCHAR(50) NOT NULL, \
    `body` MEDIUMTEXT NOT NULL,\
    `published_on` DATE NOT NULL, \
        PRIMARY KEY (`id`), \
        FOREIGN KEY (`user_email`) REFERENCES users(`email`), \
    UNIQUE INDEX `id_UNIQUE` (`id` ASC) \
)');

connection.query('\
CREATE TABLE `' + dbconfig.database + '`.`' + dbconfig.posts_table + '` ( \
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    `sender_email` VARCHAR(50) NOT NULL, \
    `receiver_email` VARCHAR(50) NOT NULL, \
        PRIMARY KEY (`id`), \
        FOREIGN KEY (`sender_email`) REFERENCES users(`email`), \
    UNIQUE INDEX `id_UNIQUE` (`id` ASC) \
)');

connection.end();