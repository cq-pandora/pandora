const { getPrefix } = require('../functions');
const {
	fileDb: { factionsFuzzy, followPath },
	categories,
	cmdResult,
} = require('../util');
const { FactionsEmbed } = require('../embeds');

const instructions = async (message) => {
	const prefix = getPrefix(message);

	const embed = {
		title: `${prefix}faction [<name>]`,
		fields: [
			{
				name: '<name>',
				value: `Get faction data.\n*e.g. ${prefix}faction han*`
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

	const candidates = factionsFuzzy.search(name);

	if (!candidates.length) {
		await message.channel.send('Faction not found!');

		return {
			status_code: cmdResult.ENTITY_NOT_FOUND,
		};
	}

	const factions = candidates.map(c => followPath(c.path));

	const embed = new FactionsEmbed(message, factions);

	await embed.send();

	return {
		status_code: cmdResult.SUCCESS,
		target: factions.map(f => f.id).join(','),
		arguments: JSON.stringify({ name }),
	};
};

exports.run = ({ message, args }) => (
	!args.length
		? instructions(message)
		: command(message, args)
);

exports.category = categories.DB;
