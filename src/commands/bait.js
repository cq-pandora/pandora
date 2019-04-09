const { getPrefix, parseQuery } = require('../functions');
const {
	fileDb: { fishingGearFuzzy, followPath },
	categories,
	cmdResult,
} = require('../util');

const BaitListEmbed = require('../embeds/FishingGearsEmbed');

const instructions = async (message) => {
	const prefix = getPrefix(message);

	const embed = {
		title: `${prefix}bait <name>`,
		fields: [
			{
				name: '<name>',
				value: 'Get bait data'
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
	const baits = candidates
		.map(c => followPath(c.path))
		.filter(b => b.type === 'bait');

	if (!baits.length) {
		await message.channel.send('Bait not found!');

		return {
			status_code: cmdResult.ENTITY_NOT_FOUND,
			target: 'bait',
		};
	}

	const embed = new BaitListEmbed(message, baits);

	await embed.send();

	return {
		status_code: cmdResult.SUCCESS,
		target: baits.map(f => f.id).join(','),
		arguments: JSON.stringify({ name }),
	};
};

exports.run = ({ message, args }) => (
	!args.length
		? instructions(message)
		: command(message, args)
);

exports.category = categories.DB;
