const config = require('../config');
const aliases = require('../db/aliases');
const _ = require('lodash');

// FIXME remove eslint-disable-line no-return-assign
module.exports = () => aliases.get()
    .then(ts => (_.reduce(ts, (r, t) => (r[t.alias] = t.for, r), config.aliases), ts)) // eslint-disable-line no-return-assign
    .then(ts => _(ts).groupBy('for').entries().reduce((res, [fogh, aliases]) => (res[fogh] = aliases.map(a => a.alias), res), config.reverseAliases)); // eslint-disable-line no-return-assign

module.exports.errorCode = 3;
