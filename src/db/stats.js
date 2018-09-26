const connect = require('./connect');

const SUBMIT_STAT_ENTRY = 'INSERT INTO stats SET ?';

exports.submit = async (stats) => {
	try {
		await connect.query(SUBMIT_STAT_ENTRY, [stats]);
	} catch (err) {
		console.log(`Error submitting stats: ${stats}`);
		console.log(err);

		throw err;
	}
};
