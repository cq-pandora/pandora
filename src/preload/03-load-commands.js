const config = require('../config');
const fs     = require('fs');
const _      = require('lodash');
const path   = require('path');

const commandsDir = '../commands/';

module.exports = () => Promise.resolve(config.commands = _.reduce(fs.readdirSync(path.resolve(__dirname, commandsDir)), (res, c) => {
    if (!c.endsWith('.js')) {
        return res;
    }

    const cmd = require(path.resolve(__dirname, commandsDir, c));
    cmd.name = c.substring(0, c.length - 3).toLowerCase();

    res[cmd.name] = cmd;
    return res;
}, {}));

module.exports.errorCode = 4;