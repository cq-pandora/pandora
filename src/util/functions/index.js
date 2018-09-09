const path = require('path');
const fs = require('fs');
const _ = require('lodash');

module.exports = _(fs.readdirSync(__dirname))
    .reduce((res, m) => {
        if (m !== 'index.js') {
            res[path.basename(m, '.js')] = require(path.resolve(__dirname, m));
        }

        return res;
    }, {});
