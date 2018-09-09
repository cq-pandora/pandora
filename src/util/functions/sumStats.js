const _ = require('lodash');

module.exports = (stat1, stat2) => _(stat1 || {}).keys()
    .reduce((res, stat) => { res[stat] = (stat1[stat] || 0) + (stat2[stat] || 0); return res; }, {});
