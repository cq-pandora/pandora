const { Client } = require('discord.js');

const fs = require('fs');
const { promisify } = require('util');
const { join: pathJoin } = require('path');

const config = require('./config');
const loadEvents = require('./util/loadEvents');

const readdir = promisify(fs.readdir).bind(fs);

(async () => {
	const client = new Client();

	const preloadDir = pathJoin(__dirname, 'preload');
	for (const file of await readdir(preloadDir)) {
		const entry = require(pathJoin(preloadDir, file));

		try {
			await entry(client);
		} catch (e) {
			console.log('Unable to start app', e);

			process.exit(entry.errorCode);
		}
	}

	client.on('ready', () => require('./events/ready')(client));

	await client.login(config.token);

	loadEvents(client);
})();
