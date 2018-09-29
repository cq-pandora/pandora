const logger = require('../logger');

module.exports = (client) => {
	logger.warn('Connection to Discord interrupted. Reconnecting...');
};
