const mysql = require('mysql');
const db = require('../config').db;

const connectionConfig = {
    host: db.host,
    user: db.user,
    password: db.password,
    database: db.database
};

module.exports = () => Promise.resolve(mysql.createConnection(connectionConfig));
