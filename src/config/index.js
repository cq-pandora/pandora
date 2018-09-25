const _ = require('lodash');

const { join: pathJoin } = require('path');

const Config = require('./Config');

const loadRootConfig = (path) => {
    path = pathJoin(__dirname, '../../', path);

    return require(path);
};

const root = new Config({
    TOKEN: 'token',
    PREFIX: 'prefix',
    CQ_NORMALIZED_DATA_PATH: 'parsedData',
    LOCAL_IMAGES_PREFIX: 'localImagePrefix',
    URL_IMAGES_PREFIX: 'imagePrefix',
    IMAGES_SUFFIX: 'imageSuffix',
    OWNER_ID: 'owner_id',
}, 'PANDORA_');

root.db = new Config({
    USER: 'user',
    PASSWORD: 'password',
    HOST: 'host',
    PORT: 'port',
    DATABASE: 'database',
}, 'PANDORA_DB_');

root.emojis = loadRootConfig('emojis.json');
root.aliases = {};
root.reverseAliases = {};

/*{
    '<server_id>': {
        users: {
            '<user_id>': {
                mode: 1, // 0 for blacklist
                commands: ['help'],
            }
        },
        roles: {
            'roles_id': {
                mode: 0, // 1 for whitelist
                commands: ['about'],
            }
        },
        channels: {
            'channel_id': {
                mode: 0, // 1 for whitelist
                commands: ['pull'],
            }
        }
    }
}
 */
root.permissions = {};

root.get = (path, defaultValue = null) => {
    if (!path) {
        return defaultValue;
    }

    return _.get(root, path, defaultValue);
};

module.exports = root;