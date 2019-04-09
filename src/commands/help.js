const _ = require('lodash');

const config = require('../config');
const {
	categories,
	cmdResult,
} = require('../util');

exports.category = categories.BOT;

exports.run = async ({ message, args }) => {
	await message.channel.send({
		embed: {
			title: 'Commands',
			description: `Prefix: ${config.prefix}, ${message.client.user}`,
			fields: _(config.commands).groupBy('category').entries().map(([name, cmds]) => ({
				name,
				inline: false,
				value: cmds
					.map(cmd => (
						`${cmd.name}${config.reverseAliases[cmd.name] ? ` (${config.reverseAliases[cmd.name].join(', ')})` : ''}`
					))
					.join(', ')
			}))
			/* footer: {
                text: `Android ${config.android_version} | iOS ${config.ios_version}`,
            }, */
		}
	});

	return {
		status_code: cmdResult.SUCCESS,
		target: 'help',
	};
};
