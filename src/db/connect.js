const mysql = require('mysql2/promise');

const { db: dbConfig } = require('../config');

const connectionConfig = {
	host: dbConfig.host,
	user: dbConfig.user,
	password: dbConfig.password,
	database: dbConfig.database,
	connectionLimit: 200,
	charset: 'utf8mb4',
};

const pool = mysql.createPool(connectionConfig);

module.exports = pool;
