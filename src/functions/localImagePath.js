const config = require('../config');

module.exports = filename => (
	`${config.localImagePrefix}${filename}${config.imageSuffix}`
);
