const { getPrefix } = require('../functions');
const {
	fileDb: { goddessesFuzzy, followPath },
	categories,
	cmdResult,
} = require('../util');
const GoddessesListEmbed = require('../embeds/GoddessesEmbed');

const instructions = async (message) => {
	const prefix = getPrefix(message);

	const embed = {
		title: `${prefix}goddess [<name>]`,
		fields: [
			{
				name: '<name>',
				value: `Get goddess data.\n*e.g. ${prefix}goddess sera*`
			}
		]
	};

	await message.channel.send({ embed });

	return {
		status_code: cmdResult.NOT_ENOUGH_ARGS,
	};
};

const command = async (message, args) => {
	const name = args.join(' ');

	const candidates = goddessesFuzzy.search(name);

	if (!candidates.length) {
		await message.channel.send('Goddess not found!');

		return {
			status_code: cmdResult.ENTITY_NOT_FOUND,
		};
	}

	const goddesses = candidates.map(c => followPath(c.path));

	const embed = new GoddessesListEmbed(message, goddesses);

	await embed.send();

	return {
		status_code: cmdResult.SUCCESS,
		target: goddesses.map(g => g.id).join(','),
		arguments: JSON.stringify({ input: args.join(' ') }),
	};
};

exports.run = ({ message, args }) => (
	!args.length
		? instructions(message)
		: command(message, args)
);

exports.category = categories.DB;
