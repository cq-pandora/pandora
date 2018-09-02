const config = require('../config');
const aliases = require('../db/aliases');
const _ = require('lodash');
const compare = require('compare-versions');

module.exports = () => aliases.get()
	.then(ts => _.reduce(ts, (r, t) => (r[t.alias] = t.for, r), config.aliases));

module.exports.errorCode = 3;