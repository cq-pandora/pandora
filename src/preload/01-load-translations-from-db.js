const data = require('../util/cq-data');
const translations = require('../db/translations');
const _ = require('lodash');
const compare = require('compare-versions');

module.exports = () => translations.get()
    .then(ts => _.reduce(ts, (r, t) => {
        if (compare(t.version, r[t.key].version) >= 0) {
            r[t.key] = t;
        } else {
            console.log(`Ignoring outdated translation for key ${t.key} (${t.version} < ${r[t.key].version})`);
        }
        return r;
    }, data.translations));

module.exports.errorCode = 1;
