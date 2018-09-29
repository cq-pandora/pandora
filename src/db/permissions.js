const connect = require('./connect');
const { permissions } = require('../config');
const { db: logger } = require('../logger');

const SET_PERMISSIONS = `INSERT INTO color_lists (server_id, target_type, target_id, mode, commands, priority) VALUES ? 
    ON DUPLICATE KEY UPDATE commands = VALUES(commands), mode = VALUES(mode), priority = VALUES(priority);`;
const CLEAR_PERMISSIONS = 'DELETE FROM color_lists WHERE (`server_id`, `target_id`, `target_type`) IN (?);';
const GET_ALL_PERMISSIONS = 'SELECT `server_id`, `target_type`, `target_id`, `mode`, `commands`, `priority` FROM color_lists;';
const GET_FOR_SERVER = 'SELECT `server_id`, `target_type`, `target_id`, `mode`, `commands`, `priority` FROM color_lists WHERE `server_id` = ?';

exports.set = async (serverId, toInsert) => {
	try {
		const normalizedPermissions = toInsert.map(
			p => [serverId, p.targetType, p.targetID, p.mode, p.commands.join(','), p.priority]
		);

		await connect.query(SET_PERMISSIONS, [normalizedPermissions]);

		normalizedPermissions.forEach(permissions.set);
	} catch (err) {
		logger.error('Error setting permissions:', permissions);

		throw err;
	}
};

exports.clear = async (toClear) => {
	try {
		await connect.query(CLEAR_PERMISSIONS, [toClear.map(p => [p.serverID, p.targetID, p.targetType])]);

		toClear.map(p => permissions.set([p.serverID, p.targetType, p.targetID, 0, '']));
	} catch (err) {
		logger.error(`Error clearing permissions for ${toClear.map(p => `${p.targetID}@${p.targetType}`)}`);

		throw err;
	}
};

exports.list = async (serverID = null) => {
	try {
		const sql = serverID
			? GET_FOR_SERVER
			: GET_ALL_PERMISSIONS;

		const [rows] = await connect.query(sql, [serverID]);

		return rows;
	} catch (err) {
		logger.error(serverID
			? `Error getting permissions for ${serverID}@server`
			: 'Error getting all permissions list');

		throw err;
	}
};
