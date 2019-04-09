const { getPrefix, parseQuery } = require('../functions');
const {
	fileDb: { fishingGearFuzzy, followPath },
	categories,
	cmdResult,
} = require('../util');
const FishingGearListEmbed = require('../embeds/FishingGearsEmbed');

const instructions = async (message) => {
	const prefix = getPrefix(message);

	const embed = {
		title: `${prefix}rod <name>`,
		fields: [
			{
				name: '<name>',
				value: 'Get rod data'
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

	const candidates = fishingGearFuzzy.search(name);
	const rods = candidates
		.map(c => followPath(c.path))
		.filter(b => b.type === 'rod');

	if (!rods.length) {
		await message.channel.send('Rod not found!');

		return {
			status_code: cmdResult.ENTITY_NOT_FOUND,
			target: 'rod',
		};
	}

	const embed = new FishingGearListEmbed(message, rods);

	await embed.send();

	return {
		status_code: cmdResult.SUCCESS,
		target: rods.map(f => f.id).join(','),
		arguments: JSON.stringify({ name }),
	};
};

exports.run = ({ message, args }) => (
	!args.length
		? instructions(message)
		: command(message, args)
);

exports.category = categories.DB;
