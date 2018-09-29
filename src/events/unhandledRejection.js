const { DiscordAPIError, Constants: { APIErrors } } = require('discord.js');

const logger = require('../logger');

const ERROR_CODES = [
	APIErrors.UNKNOWN_MESSAGE,
	APIErrors.MISSING_PERMISSIONS,
];

module.exports = (error) => {
	// Ignore discord api errors related to embed
	if (error instanceof DiscordAPIError && ERROR_CODES.includes(error.code)) {
		return;
	}

	logger.error(error);
};
