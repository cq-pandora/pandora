const { DiscordAPIError, Constants: { APIErrors } } = require('discord.js');

const logger = require('../logger');

const ERROR_CODES = [
	APIErrors.UNKNOWN_MESSAGE,
	APIErrors.MISSING_PERMISSIONS,
	APIErrors.CANNOT_EXECUTE_ON_DM,
];

const IGNORE_RAW = [
	'Two factor is required for this operation',
];

module.exports = (error) => {
	// Ignore discord api errors related to embed
	if (error instanceof DiscordAPIError && (ERROR_CODES.includes(error.code) || IGNORE_RAW.includes(error.message))) {
		return;
	}

	logger.error('Unhandled exception!', error);
};
