const { env } = process;

module.exports = class Config {
	constructor(envKeyMap, prefix) {
		prefix = prefix || '';

		for (const envKey of Object.keys(envKeyMap)) {
			this[envKeyMap[envKey]] = env[`${prefix}${envKey}`];
		}
	}
};
