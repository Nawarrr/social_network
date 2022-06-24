var mysql      = require('mysql');
var dbconfig = require('../config/database');

var connection = mysql.createConnection(dbconfig.connection)



connection.query('\
CREATE TABLE `' + dbconfig.database + '`.`' + dbconfig.posts_table + '` ( \
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    `user_id` INT UNSIGNED NOT NULL, \
    `body` MEDIUMTEXT NOT NULL,\
    `published_on` DATE NOT NULL, \
        PRIMARY KEY (`id`), \
        FOREIGN KEY (`user_id`) REFERENCES users(`id`), \
    UNIQUE INDEX `id_UNIQUE` (`id` ASC) \
)');

connection.query('\
CREATE TABLE `' + dbconfig.database + '`.`' + dbconfig.friend_req_table+ '` ( \
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    `sender_id` VARCHAR(50) NOT NULL, \
    `receiver_id` VARCHAR(50) NOT NULL, \
        PRIMARY KEY (`id`), \
        FOREIGN KEY (`sender_id`) REFERENCES users(`id`), \
        FOREIGN KEY (`receiver_id`) REFERENCES users(`id`), \
    UNIQUE INDEX `id_UNIQUE` (`id` ASC) \
)');
connection.query('\
CREATE TABLE `' + dbconfig.database + '`.`' + dbconfig.friend_req_table+ '` ( \
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    `sender_id` VARCHAR(50) NOT NULL, \
    `receiver_id` VARCHAR(50) NOT NULL, \
        PRIMARY KEY (`id`), \
        FOREIGN KEY (`sender_id`) REFERENCES users(`id`), \
        FOREIGN KEY (`receiver_id`) REFERENCES users(`id`), \
    UNIQUE INDEX `id_UNIQUE` (`id` ASC) \
)');

connection.query('\
CREATE TABLE `' + dbconfig.database + '`.`' + dbconfig.friends + '` ( \
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    `user_id` VARCHAR(50) NOT NULL, \
    `freind_id` VARCHAR(50) NOT NULL, \
        PRIMARY KEY (`id`), \
        FOREIGN KEY (`user_id`) REFERENCES users(`id`), \
        FOREIGN KEY (`freind_id`) REFERENCES users(`id`), \
    UNIQUE INDEX `id_UNIQUE` (`id` ASC) \
)');

connection.end();