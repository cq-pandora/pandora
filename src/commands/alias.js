const aliases = require('../db/aliases');
const { getPrefix } = require('../functions');
const { categories, cmdResult } = require('../util');
const { values: aliasContexts } = require('../alias-context');

const instructions = async (message) => {
	const prefix = getPrefix(message);

	const embed = {
		title: `${prefix}alias <alias> <context> <for>`,
		fields: [
			{
				name: '<alias>',
				value: 'Suggested alias. **Important**: alias can be single word only'
			},
			{
				name: '<context>',
				value: `Command name, where this alias applies. Can be one of: ${aliasContexts}`,
			},
			{
				name: '<for>',
				value: 'Alias target'
			}
		],
		footer: { text: 'Argument order matters!' }
	};

	await message.channel.send({ embed });

	return {
		status_code: cmdResult.NOT_ENOUGH_ARGS,
	};
};

const command = async (message, args) => {
	const [alias, ctx, ...rest] = args;
	const fogh = rest.join(' ');

	try {
		await aliases.submit(alias, fogh, ctx);
	} catch (error) {
		await message.channel.send('Unable to submit your alias. Please, contact bot owner.');

		throw error;
	}

	await message.channel.send('Alias request submitted');

	return {
		target: fogh,
		status_code: cmdResult.SUCCESS,
		arguments: JSON.stringify({ alias, for: fogh })
	};
};

exports.run = ({ message, args }) => (
	args.length < 2
		? instructions(message)
		: command(message, args)
);

exports.category = categories.UTIL;
