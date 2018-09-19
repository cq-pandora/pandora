const config = require('../config');
const aliases = require('../db/aliases');
const _ = require('lodash');

module.exports = () => aliases.get()
    .then(ts => (_.reduce(ts, (r, t) => { r[(t.alias || '').toLocaleLowerCase()] = t.for; return r; }, config.aliases), ts))
    .then(ts => _(ts).groupBy('for').entries().reduce((res, [fogh, aliases]) => { res[fogh] = aliases.map(a => a.alias); return res; }, config.reverseAliases));

module.exports.errorCode = 3;
