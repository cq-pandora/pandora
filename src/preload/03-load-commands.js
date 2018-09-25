const fs = require('fs');
const { promisify } = require('util');
const { join: pathJoin, basename: pathBasename } = require('path');

const config = require('../config');

const readdir = promisify(fs.readdir).bind(fs);

const EXTENSION = '.js';
const commandsDir = pathJoin(__dirname, '../commands/');

module.exports = async () => {
    const commands = config.commands;

    for (const file of await readdir(commandsDir)) {
        if (!file.endsWith(EXTENSION)) {
            continue;
        }

        const command = require(pathJoin(commandsDir, file));
        command.name = pathBasename(file, EXTENSION).toLowerCase();

        if (!command.category) {
            console.log(`FATAL: No category set for ${command.name}!`);

            process.exit(1);
        }

        commands[command.name] = command;
    }

    config.commands = commands;
};

module.exports.errorCode = 4;
