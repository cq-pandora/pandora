const config = require('../config');
const { cmdResult, categories } = require('../util');

exports.run = async ({ client, message }) => {
	await message.channel.send({
		embed: {
			title: 'About',
			description: `Made with ❤ by ${client.users.get(config.owner_id)} (${message.guild.members.get(config.owner_id).user.tag}).\n\nThis bot is not affiliated, associated, authorized by, endorsed by, or in any way officially connected with NHN Entertainment Corp., LoadComplete Inc., or any of their subsidiaries or their affiliates.`,
			fields: [
				{
					name: `Invite ${message.client.user.username}`,
					value: '[bit.ly/InvitePandora](http://bit.ly/InvitePandora)',
					inline: true,
				},
				{
					name: 'Join Servers',
					value: '[Pandora Dev Server](https://discord.gg/pK9qsJY)\n[Crusaders Quest](https://discord.gg/6TRnyhj)',
					inline: true,
				},
				{
					name: 'Git repos',
					value: '[/TrueLecter/pandora](https://github.com/TrueLecter/pandora)\n[cq-assets](https://gitlab.com/cq-data-re/cq-assets)',
					inline: true,
				},
			],
		},
	});

	return {
		target: 'about',
		status_code: cmdResult.SUCCESS,
	};
};

exports.category = categories.BOT;
