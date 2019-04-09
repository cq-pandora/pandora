const { getPrefix, parseQuery } = require('../functions');
const {
	fileDb: { heroesFuzzy, followPath },
	categories,
	cmdResult,
} = require('../util');
const HeroSkinsEmbed = require('../embeds/HeroSkinsEmbed');

const instructions = async (message) => {
	const prefix = getPrefix(message);

	const embed = {
		title: `${prefix}skin [<name>]`,
		fields: [
			{
				name: '<name>',
				value: `Get skin data.\n*e.g. ${prefix}skin lee*`
			}
		],
	};

	await message.channel.send({ embed });

	return {
		status_code: cmdResult.NOT_ENOUGH_ARGS,
	};
};

const command = async (message, args) => {
	const name = parseQuery(args);
	const [candidate] = heroesFuzzy.search(name);

	if (!candidate) {
		await message.channel.send('Hero not found!');

		return {
			status_code: cmdResult.ENTITY_NOT_FOUND,
			target: 'hero',
		};
	}

	const hero = followPath(candidate.path);

	const embed = new HeroSkinsEmbed(message, hero);

	await embed.send();

	return {
		status_code: cmdResult.SUCCESS,
		target: hero.id,
		arguments: JSON.stringify({ name }),
	};
};

exports.run = ({ message, args }) => (
	!args.length
		? instructions(message)
		: command(message, args)
);

exports.category = categories.DB;
