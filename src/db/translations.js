const connect = require('./connect');
const data = require('../util/cq-data');
const config = require('../config');

const SUBMIT_TRANSLATION = 'INSERT INTO translations (`key`, `text`, `version`) VALUES (?, ?, ?)';
const ACCEPT_TRANSLATION = 'UPDATE translations SET `status` = 1 WHERE `id` = ?';
const DECLINE_TRANSLATION = 'UPDATE translations SET `status` = 0 WHERE `id` = ?';
const DECLINE_ALL_UNACCEPTED_TRANSLATIONS = 'UPDATE translations SET `status` = 0 WHERE `key` = ? AND ISNULL(`status`)';
const GET_ALL_WITHOUT_STATUS = 'SELECT * FROM translations WHERE ISNULL(`status`)';
const GET_ALL_WITHOUT_STATUS_FOR_KEY = 'SELECT * FROM translations WHERE `key` = ? AND ISNULL(`status`)';
const GET_KEY_TRANSLATION = 'SELECT * FROM translations WHERE `key` = ? AND `status` = 1';
const GET_ALL_ACCEPTED = 'SELECT * FROM translations WHERE `status` = 1';
const GET_BY_ID = 'SELECT * FROM translations WHERE `id` = ?';
const GET_LATEST_VERSION_ACCEPTED_TRANSLATION = 
`SELECT t1.* FROM translations t1
INNER JOIN (
	SELECT MAX(INET_ATON(\`version\` + '.0')) AS intv, \`key\`
	FROM translations WHERE \`status\` = 1
    GROUP BY \`key\`
) t2 ON t1.\`key\` = t2.\`key\` AND INET_ATON(t1.version + '.0') = t2.intv
WHERE \`status\` = 1`;

exports.submit = (key, translation) => connect()
.then(con => new Promise((resolve, reject) => con.query(SUBMIT_TRANSLATION, [key, translation, config.game_version], (err, res) => err ? reject(err) : resolve(res))))
.catch(err => {
	console.log(`Error submitting translation for review: ${key} = ${translation}`);
	console.log(err);
	throw err;
});

exports.accept = (id) => connect()
.then(con => new Promise((resolve, reject) => con.query(ACCEPT_TRANSLATION, id, (err, res) => err ? reject(err) : resolve(res))))
.then(connect).then(con => con.query(GET_BY_ID, id, (err, res) => err ? console.log('Unable to apply new translation locally') : data.translations[res[0].key] = res[0]))
.catch(err => {
	console.log(`Error accepting translation: ${id}`);
	console.log(err);
	throw err;
});

exports.decline = (id) => connect()
.then(con => new Promise((resolve, reject) => con.query(DECLINE_TRANSLATION, id, (err, res) => err ? reject(err) : resolve(res))))
.catch(err => {
	console.log(`Error declining translation: ${id}`);
	console.log(err);
	throw err;
});

exports.declineAllUnaccepted = (key) => connect()
.then(con => new Promise((resolve, reject) => con.query(DECLINE_ALL_UNACCEPTED_TRANSLATIONS, key, (err, res) => err ? reject(err) : resolve(res))))
.catch(err => {
	console.log(`Error declining translations for key ${id}`);
	console.log(err);
	throw err;
});

exports.list = (key = null) => connect()
.then(con => new Promise((resolve, reject) => con.query(key ? GET_ALL_WITHOUT_STATUS_FOR_KEY : GET_ALL_WITHOUT_STATUS, key, (err, res) => err ? reject(err) : resolve(res))))
.catch(err => {
	console.log(`Error getting translations: ${key}`);
	console.log(err);
	throw err;
});

exports.get = (key) => connect()
.then(con => new Promise((resolve, reject) => con.query(key ? GET_KEY_TRANSLATION : GET_LATEST_VERSION_ACCEPTED_TRANSLATION, key, (err, res) => err ? reject(err) : resolve(res))))
.catch(err => {
	console.log(`Error getting translation: ${key}`);
	console.log(err);
	throw err;
});