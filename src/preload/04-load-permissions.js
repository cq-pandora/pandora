const { permissions } = require('../config');
const { list } = require('../db/permissions');

module.exports = async () => {
	for (const p of await list()) {
		permissions.set([p.server_id, p.target_type, p.target_id, p.mode[0], p.commands, p.priority]);
	}
};

module.exports.errorCode = 5;
