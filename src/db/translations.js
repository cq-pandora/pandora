const connect = require('./connect');
const data = require('../util/cq-data');
const config = require('../config');
const { db: logger } = require('../logger');

const SUBMIT_TRANSLATION = 'INSERT INTO translations (`key`, `text`, `version`) VALUES (?, ?, ?)';
const ACCEPT_TRANSLATION = 'UPDATE translations SET `status` = 1 WHERE `id` = ?';
const DECLINE_TRANSLATION = 'UPDATE translations SET `status` = 0 WHERE `id` = ?';
const DECLINE_ALL_UNACCEPTED_TRANSLATIONS = 'UPDATE translations SET `status` = 0 WHERE `key` = ? AND ISNULL(`status`)';
const GET_ALL_WITHOUT_STATUS = 'SELECT * FROM translations WHERE ISNULL(`status`)';
const GET_ALL_WITHOUT_STATUS_FOR_KEY = 'SELECT * FROM translations WHERE `key` = ? AND ISNULL(`status`)';
const GET_KEY_TRANSLATION = 'SELECT * FROM translations WHERE `key` = ? AND `status` = 1';
// const GET_ALL_ACCEPTED = 'SELECT * FROM translations WHERE `status` = 1';
const GET_BY_ID = 'SELECT * FROM translations WHERE `id` = ?';
const GET_LATEST_VERSION_ACCEPTED_TRANSLATION = `SELECT t1.* FROM translations t1
INNER JOIN (
    SELECT MAX(INET_ATON(\`version\` + '.0')) AS intv, \`key\`
    FROM translations WHERE \`status\` = 1
    GROUP BY \`key\`
) t2 ON t1.\`key\` = t2.\`key\` AND INET_ATON(t1.version + '.0') = t2.intv
WHERE \`status\` = 1`;

exports.submit = async (key, translation) => {
	try {
		await connect.query(SUBMIT_TRANSLATION, [key, translation, config.game_version]);
	} catch (err) {
		logger.error(`Error submitting translation for review: ${key} = ${translation}`);

		throw err;
	}
};

exports.accept = async (id) => {
	try {
		await connect.query(ACCEPT_TRANSLATION, [id]);

		const [[row]] = await connect.query(GET_BY_ID, [id]);

		data.translations[row.key] = row;

		return row;
	} catch (err) {
		logger.error(`Error accepting translation: ${id}`);

		throw err;
	}
};

exports.decline = async (id) => {
	try {
		await connect.query(DECLINE_TRANSLATION, [id]);
	} catch (err) {
		logger.error(`Error declining translation: ${id}`);

		throw err;
	}
};

exports.declineAllUnaccepted = async (key) => {
	try {
		await connect.query(DECLINE_ALL_UNACCEPTED_TRANSLATIONS, [key]);
	} catch (err) {
		logger.error(`Error declining translations for key ${key}`);

		throw err;
	}
};

exports.list = async (key = null) => {
	try {
		const sql = key
			? GET_ALL_WITHOUT_STATUS_FOR_KEY
			: GET_ALL_WITHOUT_STATUS;

		const [rows] = await connect.query(sql, [key]);

		return rows;
	} catch (err) {
		logger.error(`Error getting translations: ${key}`);

		throw err;
	}
};

exports.get = async (key) => {
	try {
		const sql = key
			? GET_KEY_TRANSLATION
			: GET_LATEST_VERSION_ACCEPTED_TRANSLATION;

		const [rows] = await connect.query(sql, [key]);

		return rows;
	} catch (err) {
		logger.error(`Error getting translations: ${key}`);

		throw err;
	}
};
