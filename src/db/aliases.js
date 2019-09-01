const connect = require('./connect');
const config = require('../config');
const { db: logger } = require('../logger');

const SUBMIT_ALIAS = 'INSERT INTO aliases (`alias`, `for`, `context`) VALUES (?, ?, ?)';
const ACCEPT_ALIAS = 'UPDATE aliases SET `status` = 1 WHERE `alias` = ? AND `context` = ?';
const DECLINE_ALIAS = 'DELETE FROM aliases WHERE `alias` = ? AND `context` = ?';
const DECLINE_ALL_UNACCEPTED_ALIASES = 'DELETE FROM aliases WHERE `for` = ? AND ISNULL(`status`)';
const GET_ALL = 'SELECT * FROM aliases';
const GET_ALL_WITHOUT_STATUS = 'SELECT * FROM aliases WHERE ISNULL(`status`)';
const GET_ALL_WITHOUT_STATUS_FOR_KEY = 'SELECT * FROM aliases WHERE `for` = ? AND ISNULL(`status`)';
// const GET_KEY_ALIAS = 'SELECT * FROM aliases WHERE `for` = ? AND `status` = 1';
const GET_ALL_ACCEPTED = 'SELECT * FROM aliases WHERE `status` = 1';
const GET_BY_ALIAS = 'SELECT * FROM aliases WHERE `alias` = ?';
const GET_BY_ALIAS_CONTEXT = 'SELECT * FROM aliases WHERE `alias` = ? AND `context` = ?';

exports.submit = async (alias, fogh, ctx) => {
	try {
		await connect.query(SUBMIT_ALIAS, [alias, fogh, ctx]);
	} catch (err) {
		logger.error(`Error submitting alias: ${ctx}:${alias} => ${fogh}`);

		throw err;
	}
};

exports.accept = async (alias, ctx) => {
	try {
		await connect.query(ACCEPT_ALIAS, [alias, ctx]);

		const [[row]] = await connect.query(GET_BY_ALIAS_CONTEXT, [alias, ctx]);

		config.setAlias(ctx, row.alias, row.for);

		return row.for;
	} catch (err) {
		logger.error(`Error accepting alias: ${ctx}:${alias}`);

		throw err;
	}
};

exports.decline = async (alias, ctx) => {
	try {
		await connect.query(DECLINE_ALIAS, [alias, ctx]);
	} catch (err) {
		logger.error(`Error declining alias: ${ctx}:${alias}`);

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

		console.log(sql);

		const [rows] = await connect.query(sql, [fogh]);

		return rows;
	} catch (err) {
		logger.error(`Error getting alias for ${fogh}`);

		throw err;
	}
};

exports.listAll = async () => {
	try {
		const [rows] = await connect.query(GET_ALL);

		return rows;
	} catch (err) {
		logger.error('Error getting aliases');

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
