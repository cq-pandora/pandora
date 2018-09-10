const connect = require('./connect');

const SUBMIT_STAT_ENTRY = 'INSERT INTO stats SET ?';

exports.submit = (stats) => connect()
    .then(con => new Promise((resolve, reject) => con.query(SUBMIT_STAT_ENTRY,
        stats,
        (err, res) => err ? reject(err) : resolve(res))
    ))
    .catch(err => {
        console.log(`Error submitting stats: ${stats}`);
        console.log(err);
        throw err;
    });
