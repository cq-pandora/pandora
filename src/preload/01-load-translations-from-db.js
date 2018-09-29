const compare = require('compare-versions');

const logger = require('../logger');
const data = require('../util/cq-data');
const { get: getTranslation } = require('../db/translations');

module.exports = async () => {
	const { translations } = data;

	for (const translation of await getTranslation()) {
		const { key, version } = translation;
		const { version: accumulatorVersion } = translations;

		if (compare(version, accumulatorVersion) >= 0) {
			translations[key] = translation;
		} else {
			logger.warn(`Ignoring outdated translation for key ${key} (${version} < ${accumulatorVersion})`);
		}
	}
};

module.exports.errorCode = 1;
