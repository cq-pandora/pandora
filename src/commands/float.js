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
		title: `${prefix}float <name>`,
		fields: [
			{
				name: '<name>',
				value: 'Get float data'
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

	const floats = candidates
		.map(c => followPath(c.path))
		.filter(b => b.type === 'float');

	if (!floats.length) {
		await message.channel.send('Float not found!');

		return {
			status_code: cmdResult.ENTITY_NOT_FOUND,
			target: 'float',
		};
	}

	const embed = new FishingGearListEmbed(message, floats);

	await embed.send();

	return {
		status_code: cmdResult.SUCCESS,
		target: floats.map(f => f.id).join(','),
		arguments: JSON.stringify({ name }),
	};
};

exports.run = ({ message, args }) => (
	!args.length
		? instructions(message)
		: command(message, args)
);

exports.category = categories.DB;
