// config/database.js
module.exports = {
    'connection_create': {
        'host': 'localhost',
        'user': 'USER',
        'password': 'PASS',
    },
    'connection': {
        'host': 'localhost',
        'user': 'USER',
        'password': 'PASS',
        'database': 'social_network',
    },
	'database': 'social_network',
    'users_table': 'users',
    'posts_table': 'posts',
    'friend_req_table' : 'friend_reqs',
    'friends_table' : 'friends'
};
