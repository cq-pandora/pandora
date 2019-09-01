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
root.package = loadRootConfig('package.json');
root.commands = {};
root.aliases = {};
root.reverseAliases = {};

root.setAlias = (ctx, aliasRaw = '', f = '') => {
	const contextAliases = root.aliases[ctx] = root.aliases[ctx] || {};
	const contextReverseAliases = root.reverseAliases[ctx] = root.reverseAliases[ctx] || {};

	const reverseAliasEntry = contextReverseAliases[f] = contextReverseAliases[f] || [];

	const alias = aliasRaw.toLowerCase();

	contextAliases[alias] = f;

	if (!reverseAliasEntry.includes(alias)) {
		reverseAliasEntry.push(alias);
	}
};

root.getAlias = (ctx, alias) => (root.aliases[ctx] || {})[alias];

root.getCommandAliases = cmd => (root.reverseAliases.commands || {})[cmd];

root.removeAlias = (ctx, aliasRaw) => {
	const contextAliases = root.aliases[ctx] = root.aliases[ctx] || {};
	const contextReverseAliases = root.reverseAliases[ctx] = root.reverseAliases[ctx] || {};

	const alias = aliasRaw.toLowerCase();
	const target = contextAliases[alias];

	if (!target) {
		return false;
	}

	delete contextAliases[alias];

	contextReverseAliases[target] = (contextReverseAliases[target] || [])
		.filter(a => a !== alias);

	return true;
};

/* {
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

const defaultPriorities = {
	user: 3,
	channel: 2,
	role: 1,
};

function setPermission(normalizedPermission) {
	const [serverId, targetType, targetID, mode, commands, priority] = normalizedPermission;

	const serverPermissions = this[serverId] || {};
	const { users = {}, channels = {}, roles = {} } = serverPermissions;

	const collection = ({
		user: users,
		channel: channels,
		role: roles,
	})[targetType];

	collection[targetID] = {
		mode,
		commands: commands.split(','),
		priority: priority || defaultPriorities[targetType],
	};

	serverPermissions.users = users;
	serverPermissions.channels = channels;
	serverPermissions.roles = roles;

	this[serverId] = serverPermissions;
}

function mergePermissions(normalizedPermission) {
	const [serverID, targetType, targetID, mode, rawCommands, priority] = normalizedPermission;

	if (!rawCommands.length) {
		return {
			serverID,
			targetType,
			targetID,
			commands: [],
		};
	}

	const commandNames = Object.keys(root.commands);
	const commands = rawCommands.filter(c => commandNames.includes(c));

	const serverPermissions = this[serverID] || {};
	const { users = {}, channels = {}, roles = {} } = serverPermissions;

	const collection = ({
		user: users,
		channel: channels,
		role: roles,
	})[targetType];

	const {
		mode: currentMode = null,
		commands: currentCommands = [],
		priority: currentPriority = defaultPriorities[targetType]
	} = collection[targetID] || {};

	let merged;

	if (currentMode === mode) {
		merged = {
			mode,
			priority: priority || currentPriority,
			commands: _.uniq(currentCommands.concat(commands)),
		};
	} else if (mode < 0) {
		merged = {
			mode: currentMode,
			priority: currentPriority,
			commands: _.pullAll(currentCommands, commands),
		};
	} else {
		merged = {
			mode,
			priority: priority || defaultPriorities[targetType],
			commands,
		};
	}

	return {
		serverId: serverID,
		targetType,
		targetID,
		mode: merged.mode,
		commands: merged.commands,
		priority: merged.priority
	};
}

root.permissions.set = setPermission.bind(root.permissions);
root.permissions.merge = mergePermissions.bind(root.permissions);

root.get = (path, defaultValue = null) => {
	if (!path) {
		return defaultValue;
	}

	return _.get(root, path, defaultValue);
};

module.exports = root;
