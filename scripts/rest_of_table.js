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
    `id` INT UNSIGNED NOT NULL, \
    `sender_id` INT UNSIGNED NOT NULL, \
        FOREIGN KEY (`sender_id`) REFERENCES users(`id`), \
        FOREIGN KEY (`id`) REFERENCES users(`id`), \
        PRIMARY KEY (`id`,`sender_id`) \
)');


connection.query('\
CREATE TABLE `' + dbconfig.database + '`.`' + dbconfig.friends_table + '` ( \
    `user_id` INT UNSIGNED NOT NULL, \
    `friend_id` INT UNSIGNED NOT NULL, \
        PRIMARY KEY (`user_id`,`friend_id`), \
        FOREIGN KEY (`user_id`) REFERENCES users(`id`), \
        FOREIGN KEY (`friend_id`) REFERENCES users(`id`) \
)');

connection.end();