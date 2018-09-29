const connect = require('./connect');
const config = require('../config');
const { db: logger } = require('../logger');

const SUBMIT_ALIAS = 'INSERT INTO aliases (`alias`, `for`) VALUES (?, ?)';
const ACCEPT_ALIAS = 'UPDATE aliases SET `status` = 1 WHERE `alias` = ?';
const DECLINE_ALIAS = 'DELETE FROM aliases WHERE `alias` = ?';
const DECLINE_ALL_UNACCEPTED_ALIASES = 'DELETE FROM aliases WHERE `fogh` = ? AND ISNULL(`status`)';
const GET_ALL_WITHOUT_STATUS = 'SELECT * FROM aliases WHERE ISNULL(`status`)';
const GET_ALL_WITHOUT_STATUS_FOR_KEY = 'SELECT * FROM aliases WHERE `for` = ? AND ISNULL(`status`)';
// const GET_KEY_ALIAS = 'SELECT * FROM aliases WHERE `for` = ? AND `status` = 1';
const GET_ALL_ACCEPTED = 'SELECT * FROM aliases WHERE `status` = 1';
const GET_BY_ALIAS = 'SELECT * FROM aliases WHERE `alias` = ?';

exports.submit = async (alias, fogh) => {
	try {
		await connect.query(SUBMIT_ALIAS, [alias, fogh]);
	} catch (err) {
		logger.error(`Error submitting alias: ${alias} => ${fogh}`);

		throw err;
	}
};

exports.accept = async (alias) => {
	try {
		await connect.query(ACCEPT_ALIAS, [alias]);

		const [[row]] = await connect.query(GET_BY_ALIAS, [alias]);

		config.aliases[alias.toLowerCase()] = row.for;

		return row.for;
	} catch (err) {
		logger.error(`Error accepting alias: ${alias}`);

		throw err;
	}
};

exports.decline = async (alias) => {
	try {
		await connect.query(DECLINE_ALIAS, [alias]);
	} catch (err) {
		logger.error(`Error declining alias: ${alias}`);

		throw err;
	}
};

exports.declineAllUnaccepted = async (fogh) => {
	try {
		await connect.query(DECLINE_ALL_UNACCEPTED_ALIASES, [fogh]);
	} catch (err) {
		logger.error(`Error declining aliases for key ${fogh}`);

		throw err;
	}
};

exports.list = async (fogh = null) => {
	try {
		const sql = fogh
			? GET_ALL_WITHOUT_STATUS_FOR_KEY
			: GET_ALL_WITHOUT_STATUS;

		const [rows] = await connect.query(sql, [fogh]);

		return rows;
	} catch (err) {
		logger.error(`Error getting alias for ${fogh}`);

		throw err;
	}
};

exports.get = async (fogh = null) => {
	try {
		const sql = fogh
			? GET_BY_ALIAS
			: GET_ALL_ACCEPTED;

		const [rows] = await connect.query(sql, [fogh]);

		return rows;
	} catch (err) {
		logger.error(`Error getting aliases for ${fogh}`);

		throw err;
	}
};
