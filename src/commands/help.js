const _ = require('lodash');

const { prefix, commands, getCommandAliases } = require('../config');
const {
	categories,
	cmdResult,
} = require('../util');

exports.category = categories.BOT;

exports.run = async ({ message }) => {
	await message.channel.send({
		embed: {
			title: 'Commands',
			description: `Prefix: ${prefix}, ${message.client.user}`,
			fields: _(commands).groupBy('category').entries().map(([name, cmds]) => ({
				name,
				inline: false,
				value: cmds
					.map((cmd) => {
						const aliases = getCommandAliases(cmd.name);

						if (!aliases) return cmd.name;

						return `${cmd.name} (${aliases.join(', ')})`;
					})
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
