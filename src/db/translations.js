const connect = require('./connect');

const SUBMIT_TRANSLATION = 'INSERT INTO translations (`key`, `translation`) VALUES (?, ?)';
const ACCEPT_TRANSLATION = 'UPDATE translations SET `status` = 1 WHERE `id` = ?';
const DECLINE_TRANSLATION = 'UPDATE translations SET `status` = 0 WHERE `id` = ?';
const DECLINE_ALL_UNACCEPTED_TRANSLATIONS = 'UPDATE translations SET `status` = 0 WHERE `key` = ? AND ISNULL(`status`)';
const GET_ALL_WITHOUT_STATUS = 'SELECT * FROM translations WHERE ISNULL(`status`)';
const GET_ALL_WITHOUT_STATUS_FOR_KEY = 'SELECT * FROM translations WHERE `key` = ? AND ISNULL(`status`)';
const GET_KEY_TRANSLATION = 'SELECT * FROM translations WHERE `key` = ? AND `status` = 1';

exports.submit = (key, translation) => connect()
.then(con => new Promise((resolve, reject) => con.query(SUBMIT_TRANSLATION, [key, translation], (err, res) => err ? reject(err) : resolve(res))))
.catch(err => {
	console.log(`Error submitting translation for review: ${key} = ${translation}`);
	console.log(err);
});

exports.accept = (id) => connect()
.then(con => new Promise((resolve, reject) => con.query(ACCEPT_TRANSLATION, id, (err, res) => err ? reject(err) : resolve(res))))
.catch(err => {
	console.log(`Error accepting translation: ${id}`);
	console.log(err);
});

exports.decline = (id) => connect()
.then(con => new Promise((resolve, reject) => con.query(DECLINE_TRANSLATION, id, (err, res) => err ? reject(err) : resolve(res))))
.catch(err => {
	console.log(`Error declining translation: ${id}`);
	console.log(err);
});

exports.declineAllUnaccepted = (key) => connect()
.then(con => new Promise((resolve, reject) => con.query(DECLINE_ALL_UNACCEPTED_TRANSLATIONS, key, (err, res) => err ? reject(err) : resolve(res))))
.catch(err => {
	console.log(`Error declining translations for key ${id}`);
	console.log(err);
});

exports.list = (key = null) => connect()
.then(con => new Promise((resolve, reject) => con.query(key ? GET_ALL_WITHOUT_STATUS_FOR_KEY : GET_ALL_WITHOUT_STATUS, key, (err, res) => err ? reject(err) : resolve(res))))
.catch(err => {
	console.log(`Error getting translations: ${key}`);
	console.log(err);
});

exports.get = (key) => connect()
.then(con => new Promise((resolve, reject) => con.query(GET_KEY_TRANSLATION, key, (err, res) => err ? reject(err) : resolve(res))))
.catch(err => {
	console.log(`Error getting translation: ${key}`);
	console.log(err);
});