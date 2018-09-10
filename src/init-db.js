const createDbManager = require('manage-database');
const config = require('./config');

const dbManager = createDbManager({
    user: config.db.user,
    password: config.db.password,
    host: config.db.host,
    port: config.db.port,
    dialect: 'mysql'
});

dbManager.createAsync('cqdata')
    .then(() => process.exit(0))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
