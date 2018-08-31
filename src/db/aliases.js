const connect = require('./connect');
const config = require('../config');

const SUBMIT_ALIAS = 'INSERT INTO aliases (`alias`, `for`) VALUES (?, ?)';
const ACCEPT_ALIAS = 'UPDATE aliases SET `status` = 1 WHERE `alias` = ?';
const DECLINE_ALIAS = 'DELETE FROM aliases WHERE `alias` = ?';
const DECLINE_ALL_UNACCEPTED_ALIASES = 'DELETE FROM aliases WHERE `fogh` = ? AND ISNULL(`status`)';
const GET_ALL_WITHOUT_STATUS = 'SELECT * FROM aliases WHERE ISNULL(`status`)';
const GET_ALL_WITHOUT_STATUS_FOR_KEY = 'SELECT * FROM aliases WHERE `for` = ? AND ISNULL(`status`)';
const GET_KEY_ALIAS = 'SELECT * FROM aliases WHERE `for` = ? AND `status` = 1';
const GET_ALL_ACCEPTED = 'SELECT * FROM aliases WHERE `status` = 1';
const GET_BY_ALIAS = 'SELECT * FROM aliases WHERE `alias` = ?';

exports.submit = (alias, fogh) => connect()
.then(con => new Promise((resolve, reject) => con.query(SUBMIT_ALIAS, [alias, fogh], (err, res) => err ? reject(err) : resolve(res))))
.catch(err => {
	console.log(`Error submitting alias: ${alias} => ${fogh}`);
	console.log(err);
	throw err;
});

exports.accept = (alias) => connect()
.then(con => new Promise((resolve, reject) => con.query(ACCEPT_ALIAS, alias, (err, res) => err ? reject(err) : resolve(res))))
.then(connect).then(con => con.query(GET_BY_ALIAS, alias, (err, res) => err ? console.log('Unable to apply new alias locally') : config.alias[alias] = res[0].for))
.catch(err => {
	console.log(`Error accepting alias: ${alias}`);
	console.log(err);
	throw err;
});

exports.decline = (alias) => connect()
.then(con => new Promise((resolve, reject) => con.query(DECLINE_ALIAS, alias, (err, res) => err ? reject(err) : resolve(res))))
.catch(err => {
	console.log(`Error declining alias: ${alias}`);
	console.log(err);
	throw err;
});

exports.declineAllUnaccepted = (fogh) => connect()
.then(con => new Promise((resolve, reject) => con.query(DECLINE_ALL_UNACCEPTED_ALIASES, fogh, (err, res) => err ? reject(err) : resolve(res))))
.catch(err => {
	console.log(`Error declining aliases for key ${fogh}`);
	console.log(err);
	throw err;
});

exports.list = (fogh = null) => connect()
.then(con => new Promise((resolve, reject) => con.query(fogh ? GET_ALL_WITHOUT_STATUS_FOR_KEY : GET_ALL_WITHOUT_STATUS, fogh, (err, res) => err ? reject(err) : resolve(res))))
.catch(err => {
	console.log(`Error getting alias for ${fogh}`);
	console.log(err);
	throw err;
});

exports.get = (fogh = null) => connect()
.then(con => new Promise((resolve, reject) => con.query(fogh ? GET_BY_ALIAS : GET_ALL_ACCEPTED, fogh, (err, res) => err ? reject(err) : resolve(res))))
.catch(err => {
	console.log(`Error getting aliases for ${fogh}`);
	console.log(err);
	throw err;
});