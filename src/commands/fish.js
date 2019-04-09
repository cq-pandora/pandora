const { getPrefix, parseQuery } = require('../functions');
const {
	fileDb: { fishesFuzzy, followPath },
	categories,
	cmdResult,
} = require('../util');

const FishListEmbed = require('../embeds/FishesEmbed');

const instructions = async (message) => {
	const prefix = getPrefix(message);

	const embed = {
		title: `${prefix}fish [<name>]`,
		fields: [
			{
				name: '<name>',
				value: 'Get fish data'
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

	const candidates = fishesFuzzy.search(name);

	if (!candidates.length) {
		await message.channel.send('Fish not found!');

		return {
			status_code: cmdResult.ENTITY_NOT_FOUND,
		};
	}

	const fishes = candidates.map(c => followPath(c.path));

	const embed = new FishListEmbed(message, fishes);

	await embed.send();

	return {
		status_code: cmdResult.SUCCESS,
		target: fishes.map(f => f.id).join(','),
		arguments: JSON.stringify({ name }),
	};
};

exports.run = ({ message, args }) => (
	!args.length
		? instructions(message)
		: command(message, args)
);

exports.category = categories.DB;
