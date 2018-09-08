const mysql = require('mysql');
const config = require('../config');

const connectionConfig = {
    host: config.get('db.host'),
    user: config.get('db.user'),
    password: config.get('db.password'),
    database: config.get('db.db')
};

module.exports = () => Promise.resolve(mysql.createConnection(connectionConfig));
