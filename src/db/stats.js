const connect = require('./connect');
const { db: logger } = require('../logger');

const SUBMIT_STAT_ENTRY = 'INSERT INTO stats SET ?';

exports.submit = async (stats) => {
	try {
		await connect.query(SUBMIT_STAT_ENTRY, [stats]);
	} catch (err) {
		logger.error(`Error submitting stats: ${stats}`);

		throw err;
	}
};
