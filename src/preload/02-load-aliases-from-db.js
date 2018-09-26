const _ = require('lodash');
const config = require('../config');
const { get: getAliases } = require('../db/aliases');

module.exports = async () => {
	const databaseAliases = await getAliases();

	for (const { for: aliasFor, alias = '' } of databaseAliases) {
		config.aliases[alias.toLowerCase()] = aliasFor;
	}

	const aliasesGroupByFor = _.groupBy(databaseAliases, 'for');

	for (const [fogh, aliases] of Object.entries(aliasesGroupByFor)) {
		config.reverseAliases[fogh] = aliases.map(item => item.alias);
	}
};

module.exports.errorCode = 3;
