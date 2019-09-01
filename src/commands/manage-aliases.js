const { MessageEmbed } = require('discord.js');

const aliases = require('../db/aliases');
const { getPrefix, splitText } = require('../functions');
const {
	categories,
	cmdResult,
	PaginationEmbed,
} = require('../util');

const aliasesToEmbeds = (ts) => {
	ts = ts
		.sort((a, b) => `${a.context}`.localeCompare(b.context))
		.map(({ context, alias, for: fogh }) => `${context}: ${alias} => ${fogh}`)
		.join('\n');

	return splitText(ts, 1024, '\n').map((text, idx, total) => (
		new MessageEmbed()
			.setTitle('Aliases list')
			.setFooter(`Page ${idx}/${total}`)
			.addField('<context>: <alias> => <targer>', text)
	));
};

const actions = {
	'list-pending': async (message, { originalArgs }) => {
		try {
			const fogh = originalArgs.length ? originalArgs.join(' ') : null;

			const list = await aliases.list(fogh);

			if (!list.length) {
				await message.channel.send('No pending aliases!');
				return;
			}

			const embed = new PaginationEmbed(message)
				.setArray(aliasesToEmbeds(list))
				.setAuthorizedUsers([message.author.id])
				.setChannel(message.channel)
				.showPageIndicator(false)
				.build();

			await embed;
		} catch (error) {
			message.channel.send('Unable to list aliases. Please, contact bot owner.');

			throw error;
		}
	},
	list: async (message) => {
		try {
			const list = await aliases.listAll();

			if (!list.length) {
				await message.channel.send('No aliases defined!');
				return;
			}

			const embed = new PaginationEmbed(message)
				.setArray(aliasesToEmbeds(list))
				.setAuthorizedUsers([message.author.id])
				.setChannel(message.channel)
				.showPageIndicator(false)
				.build();

			await embed;
		} catch (error) {
			message.channel.send('Unable to list aliases. Please, contact bot owner.');

			throw error;
		}
	},
	accept: async (message, { alias, context }) => {
		try {
			await aliases.accept(alias, context);

			await message.channel.send('Alias accepted!');
		} catch (error) {
			await message.channel.send('Unable to accept alias. Please, contact bot owner.');

			throw error;
		}
	},
	decline: async (message, { alias, context }) => {
		try {
			await aliases.decline(alias, context);

			await message.channel.send('Alias declined!');
		} catch (error) {
			await message.channel.send('Unable to alias translation. Please, contact bot owner.');

			throw error;
		}
	},
	clear: async (message, { originalArgs: [fogh] }) => {
		try {
			await aliases.declineAllUnaccepted(fogh);

			await message.channel.send('Aliases cleared!');
		} catch (error) {
			await message.channel.send('Unable to clear aliases. Please, contact bot owner.');

			throw error;
		}
	}
};

const actionsText = Object.keys(actions).join(', ');

const instructions = async (message) => {
	const prefix = getPrefix(message);
	const embed = {
		title: `${prefix}manage-aliases <action> [<alias>] [<context>] [<for>]`,
		fields: [
			{
				name: '<action>',
				value: `Action to perform.\nCan be ${actionsText}`,
			},
			{
				name: '<alias>',
				value: 'Alias to work with. **Important**: alias should not contain space'
			},
			{
				name: '<context>',
				value: 'Command name, where this alias applies',
			},
			{
				name: '<for>',
				value: 'Target for alias.\n**Important**: test if bot can find what you want to alias by that alias'
			}
		],
		footer: { text: 'Argument order matters!' }
	};

	await message.channel.send({ embed });

	return {
		status_code: cmdResult.NOT_ENOUGH_ARGS,
	};
};

const command = async (message, [nameAction, ...args]) => {
	const [alias, context, ...etc] = args;

	const fogh = etc.join(' ');
	nameAction = nameAction.toLowerCase();

	const cmdArgs = {
		action: nameAction,
		alias,
		context,
		fogh,
		originalArgs: args,
	};

	const action = actions[nameAction];

	if (!action) {
		await message.channel.send('Unknown action!');

		return {
			status_code: cmdResult.ENTITY_NOT_FOUND,
			target: 'action',
			arguments: JSON.stringify(cmdArgs),
		};
	}

	const response = await action(message, cmdArgs);

	if (!response) {
		return {
			status_code: cmdResult.SUCCESS,
			target: alias || '*',
			arguments: JSON.stringify(cmdArgs),
		};
	}

	return response;
};

exports.run = ({ message, args }) => (
	args.length < 1
		? instructions(message)
		: command(message, args)
);

exports.protected = true;

exports.category = categories.PROTECTED;
