var mysql  = require('mysql');
var dbconfig = require('../config/database');

var connection = mysql.createConnection(dbconfig.connection)

connection.query('\
CREATE TABLE `' + dbconfig.database + '`.`' + dbconfig.posts_table + '` ( \
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    `user_id` INT UNSIGNED NOT NULL, \
    `body` MEDIUMTEXT NOT NULL,\
    `published_on` DATETIME NOT NULL, \
        PRIMARY KEY (`id`), \
        FOREIGN KEY (`user_id`) REFERENCES users(`id`), \
    UNIQUE INDEX `id_UNIQUE` (`id` ASC) \
)');

connection.query('\
CREATE TABLE `' + dbconfig.database + '`.`' + dbconfig.friend_req_table+ '` ( \
    `sender_id` INT UNSIGNED NOT NULL, \
    `receiver_id` INT UNSIGNED NOT NULL, \
        FOREIGN KEY (`sender_id`) REFERENCES users(`id`), \
        FOREIGN KEY (`receiver_id`) REFERENCES users(`id`), \
        PRIMARY KEY (`sender_id`,`receiver_id`) \
)');


connection.query('\
CREATE TABLE `' + dbconfig.database + '`.`' + dbconfig.freinds_table + '` ( \
    `user_id` INT UNSIGNED NOT NULL, \
    `freind_id` INT UNSIGNED NOT NULL, \
        PRIMARY KEY (`user_id`,`freind_id`), \
        FOREIGN KEY (`user_id`) REFERENCES users(`id`), \
        FOREIGN KEY (`freind_id`) REFERENCES users(`id`) \
)');

connection.end();