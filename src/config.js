const path   = require('path');
const config = require(path.join(process.cwd(), 'config.json'));
const _      = require('lodash');

config.get = (path, defauld = null) => {
	if (!path) return defauld;

	path = _.toPath(path);
	let value = config;

	for (let i = 0; i < path.length; i++) {
		value = value[path[i]];

		if (value === undefined) return defauld;
	}

	return value || defauld;
};

if (!config.aliases) config.aliases = {};
if (!config.reverseAliases) config.reverseAliases = {};

module.exports = config;