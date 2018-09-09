const translateStat = require('./translateStat');
const _ = require('lodash');

module.exports = (obj, force) => _.entries(obj)
    .filter(([_, s]) => (s > 0 || force))
    .map(el => `**${translateStat(el[0])}**: ${el[1] < 1 ? `${(el[1] * 100).toFixed(2)}%` : el[1].toFixed(2)}`)
    .join('\n');
