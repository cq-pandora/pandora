const config = require('../config');
const axios = require('axios');

const versionRegex = /<p\s+itemprop="softwareVersion">\s*(\d+\.\d+\.\d+).*<\/p>/;

module.exports = () => axios.get('http://downloadapk.net/Crusaders-Quest.html')
    .then(r => (config.game_version = r.data.match(versionRegex)[1]));

module.exports.errorCode = 2;
