const mysql = require('mysql');
const db = require('../config').db;

const connectionConfig = {
    host: db.host,
    user: db.user,
    password: db.password,
    database: db.database,
    connectionLimit: 200,
    charset : 'utf8mb4',
};

const pool = mysql.createPool(connectionConfig);

module.exports = () => Promise.resolve(pool);
