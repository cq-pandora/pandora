const stats = require('../db/stats');
const { getPermittedCommands } = require('../functions');
const { cmdResult } = require('../util');
const {	prefix, getAlias, commands, owner_id: ownerId } = require('../config');
const { commands: logger } = require('../logger');
const { contexts } = require('../alias-context');

module.exports = (client) => {
	const mentionRe = new RegExp(`^<@!?${client.user.id}>`);

	return async (message) => {
		// ignore bot messages
		if (message.author.bot) {
			return;
		}

		const noPrefix = !prefix || !message.content.startsWith(prefix);
		const noMention = !mentionRe.test(message.content);

		// ignore if not a command
		if (noPrefix && noMention) {
			return;
		}

		// parse message into command and arguments
		let args;
		let command;
		if (noMention) {
			args = message.content.split(' ').filter(Boolean);
			command = args
				.shift()
				.slice(prefix.length)
				.toLowerCase();
		} else {
			args = message.content
				.replace(mentionRe, '')
				.trim()
				.split(' ')
				.filter(Boolean);

			if (!args.length) return;

			command = args.shift().toLowerCase();
		}

		const executable = commands[command] || commands[getAlias(contexts.COMMANDS, command)];

		if (!executable) {
			// message.channel.send('Command not found!');
			return;
		}

		const cmdId = (new Date()).getTime().toString(32);

		// I'm sorry for this long line :c
		logger.verbose(`{${cmdId}} Received request for '${executable.name}' ${args.length ? `with arguments: "${args.join(', ')}"` : 'without arguments'} from  ${message.author.tag}#${message.author.id}@${message.channel.name}#${message.channel.id}@${message.guild === null ? 'DM' : `${message.guild.name}#${message.guild.id}`}`);

		if (!(
			message.guild === null
            || getPermittedCommands(message).includes(executable.name)
		) && !message.member.hasPermission('ADMINISTRATOR', { checkAdmin: true, checkOwner: true })) {
			logger.verbose(`{${cmdId}} User ${message.author.tag}#${message.author.id} had not enough permissions to execute`);

			await message.channel.send('This command is forbidden here!');

			return;
		}

		const meta = {
			command: executable.name,
			user_id: message.author.id,
			channel_id: message.channel.id,
			server: (message.channel.guild || message.author).id,
			sent_to: message.channel.type,
			content: message.content,
		};
		const stat = {
			status_code: cmdResult.SUCCESS
		};

		try {
			if (executable.protected && message.author.id !== ownerId) {
				await message.channel.send('No enough permissions!');

				stat.status_code = cmdResult.NOT_ENOUGH_PERMISSIONS;
			} else {
				const response = await executable.run({ client, message, args });

				Object.assign(stat, response);
			}

			logger.verbose(`{${cmdId}} Command finished successfully`);
		} catch (error) {
			stat.status_code = cmdResult.FATAL;

			logger.error(`{${cmdId}} Unexpected error while executing command`, error);

			await message.channel.send('Error while executing command!');
		}

		try {
			await stats.submit({
				...meta,
				...stat
			});
		} catch (error) {
			logger.error(`{${cmdId}} Unable to submit stats`, error);
		}
	};
};
