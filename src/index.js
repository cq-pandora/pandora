const { Client } = require('discord.js');

const fs = require('fs');
const { promisify } = require('util');
const { join: pathJoin, basename } = require('path');

const logger = require('./logger');
const config = require('./config');
const loadEvents = require('./util/loadEvents');

const readdir = promisify(fs.readdir).bind(fs);

(async () => {
	logger.info(`Starting ${config.package.name}@${config.package.version}`);

	const client = new Client();

	logger.verbose('Executing preload scripts');

	const preloadDir = pathJoin(__dirname, 'preload');
	for (const file of await readdir(preloadDir)) {
		logger.verbose(`Executing preload script ${basename(file, '.js')}`);

		const entry = require(pathJoin(preloadDir, file));

		try {
			await entry(client);
		} catch (e) {
			logger.error('Unable to start app', e);

			process.exit(entry.errorCode);
		}
	}

	logger.verbose('Finished executing preload scripts');

	client.on('ready', () => require('./events/ready')(client));

	logger.info('Logging in...');
	await client.login(config.token);

	logger.verbose('Loading events...');
	loadEvents(client);
	logger.verbose('Finished loading events');
})();
