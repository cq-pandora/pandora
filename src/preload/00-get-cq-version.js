const axios = require('axios');

const config = require('../config');

const GET_VERSION_RE = /<p\s+itemprop="softwareVersion">\s*(\d+\.\d+\.\d+).*<\/p>/;

module.exports = async () => {
    const { data } = await axios.get('http://downloadapk.net/Crusaders-Quest.html');

    const { 1: version } = data.match(GET_VERSION_RE);

    config.game_version = version;
};

module.exports.errorCode = 2;
