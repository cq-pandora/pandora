const { getPrefix, parseQuery } = require('../functions');
const {
	fileDb: { bossesFuzzy, followPath },
	categories,
	cmdResult,
} = require('../util');
const BossesListEmbed = require('../embeds/BossesEmbed');

const instructions = async (message) => {
	const prefix = getPrefix(message);

	const embed = {
		title: `${prefix}boss <boss name>`,
		fields: [
			{
				name: '<boss name>',
				value: 'Get boss stats'
			}
		]
	};

	await message.channel.send({ embed });

	return {
		status_code: cmdResult.NOT_ENOUGH_ARGS,
	};
};

const command = async (message, args) => {
	const name = parseQuery(args);

	const candidates = bossesFuzzy.search(name);

	if (!candidates.length) {
		await message.channel.send('Boss not found!');

		return {
			status_code: cmdResult.ENTITY_NOT_FOUND,
		};
	}

	const bosses = candidates.map(c => followPath(c.path));

	const embed = new BossesListEmbed(message, bosses);

	await embed.send();

	return {
		status_code: cmdResult.SUCCESS,
		target: bosses.map(b => b.id).join(','),
		arguments: JSON.stringify({ name }),
	};
};

exports.run = ({ message, args }) => (
	!args.length
		? instructions(message)
		: command(message, args)
);

exports.category = categories.DB;
