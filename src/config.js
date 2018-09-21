const _ = require('lodash');

const { join: pathJoin } = require('path');

const loadRootConfig = (path) => {
    path = pathJoin(process.cwd(), path);

    return require(path);
};

const config = loadRootConfig('config.json');

config.emojis = loadRootConfig('emojis.json');
config.db = loadRootConfig('database.json').local;

if (!config.aliases) {
    config.aliases = {};
}

if (!config.reverseAliases) {
    config.reverseAliases = {};
}

config.get = (path, defaultValue = null) => {
    if (!path) {
        return defaultValue;
    }

    return _.get(config, path, defaultValue);
};

module.exports = config;
