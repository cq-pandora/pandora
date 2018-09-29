const createDbManager = require('manage-database');

const { db: dbConfig } = require('./config');

const dbManager = createDbManager({
	user: dbConfig.user,
	password: dbConfig.password,
	host: dbConfig.host,
	port: dbConfig.port,
	dialect: 'mysql'
});

dbManager.createAsync('cqdata')
	.then(() => process.exit(0))
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
