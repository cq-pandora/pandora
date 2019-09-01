const config = require('../config');
const { get: getAliases } = require('../db/aliases');
const logger = require('../logger');

module.exports = async () => {
	const databaseAliases = await getAliases();

	let validAliases = 0;

	for (const { context, alias = '', for: target } of databaseAliases) {
		if (!context) {
			logger.warn(`Invalid alias without context: ${alias} => ${target}`);
		} else {
			config.setAlias(context, alias, target);
			validAliases += 1;
		}
	}

	logger.verbose(`Loaded ${validAliases}/${databaseAliases.length} aliases`);
};

module.exports.errorCode = 3;
