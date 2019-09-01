const compare = require('compare-versions');

const logger = require('../logger');
const data = require('../util/cq-data');
const { get: getTranslation } = require('../db/translations');

module.exports = async () => {
	const { translations } = data;
	const dbTranslations = await getTranslation();

	let validTranslations = 0;

	for (const translation of dbTranslations) {
		const { key, version } = translation;
		const { version: accumulatorVersion } = translations;

		if (compare(version, accumulatorVersion) >= 0) {
			translations[key] = translation;
			validTranslations += 1;
		} else {
			logger.warn(`Ignoring outdated translation for key ${key} (${version} < ${accumulatorVersion})`);
		}
	}

	logger.verbose(`Loaded ${validTranslations}/${dbTranslations.length} translations`);
};

module.exports.errorCode = 1;
