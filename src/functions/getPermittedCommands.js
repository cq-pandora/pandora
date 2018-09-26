const { commands, permissions } = require('../config');

module.exports = (message) => {
	const serverPermissions = permissions[message.guild.id];

	if (!serverPermissions) {
		return Object.keys(commands);
	}

	const { users = {}, channels = {}, roles = {} } = serverPermissions;

	const userList = users[message.member.id];
	const channelList = channels[message.channel.id];
	const rolesLists = message.member.roles.map(r => roles[r.id]);

	const sortedLists = [userList, channelList, ...rolesLists].filter(Boolean).sort(list => list.priority);

	if (!sortedLists.length) {
		return Object.keys(commands);
	}

	return sortedLists.reduce(
		(res, list) => (list.mode
			? list.commands
			: res.filter(cmd => !list.commands.includes(cmd))),
		sortedLists[0].mode
			? sortedLists[0].commands
			: Object.keys(commands),
	);
};
