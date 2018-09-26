const config = require('../config');

module.exports = message => (
	!config.prefix
		? `@${message.client.user.username} `
		: config.prefix
);
