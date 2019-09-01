const axios = require('axios');

const config = require('../config');
const logger = require('../logger');

const GET_VERSION_RE = /Latest Version:\s*<\/strong>\s*<\/p>\s*<p>\s*(\d+\.\d+\.\d+).*<\/p>/;

module.exports = async () => {
	const { data } = await axios.get('https://apkpure.com/crusaders-quest/com.nhnent.SKQUEST');

	const { 1: version } = data.match(GET_VERSION_RE);

	config.game_version = version;

	logger.verbose(`Using game version: ${config.game_version}`);
};

module.exports.errorCode = 2;
