const config = require('../config');

module.exports = filename => (
	`${config.imagePrefix}${filename}${config.imageSuffix}`
);
