const { getPrefix, parseInheritance, parseQuery } = require('../functions');
const {
	fileDb: { heroesFuzzy, followPath },
	categories,
	cmdResult,
} = require('../util');
const HeroInheritanceEmbed = require('../embeds/HeroInheritanceEmbed');

const instructions = async (message) => {
	const prefix = getPrefix(message);
	const embed = {
		title: `${prefix}inherit [<name>] [<inheritance level>]`,
		fields: [
			{
				name: '<name>',
				value: `Get hero inheritance stats.\n*e.g. ${prefix}hero lee*`
			},
			{
				name: '<inheritance level>',
				value: `Get hero specific inheritance level stats.\n*e.g. ${prefix}hero lee 7*`
			}
		]
	};

	await message.channel.send({ embed });

	return {
		status_code: cmdResult.NOT_ENOUGH_ARGS,
	};
};

const command = async (message, args) => {
	const iLvl = parseInheritance(args);
	const name = parseQuery(args, [iLvl]);

	const [candidate] = heroesFuzzy.search(name);

	if (!candidate) {
		await message.channel.send('Hero not found!');

		return {
			status_code: cmdResult.ENTITY_NOT_FOUND,
		};
	}

	const hero = followPath(candidate.path);
	const form = hero.forms.find(f => f.star === 6);

	if (!form) {
		await message.channel.send('Hero cannot be inherited!');

		return {
			status_code: cmdResult.ENTITY_GRADE_NOT_FOUND,
		};
	}

	const levels = (iLvl || iLvl === 0)
		? [iLvl]
		: [0, 5, 10, 15, 20];

	const embed = new HeroInheritanceEmbed(message, hero, levels);

	await embed.send();

	return {
		status_code: cmdResult.SUCCESS,
		target: hero.id,
		arguments: JSON.stringify({ name, inheritance: iLvl }),
	};
};

exports.run = ({ message, args }) => (
	!args.length
		? instructions(message)
		: command(message, args)
);

exports.category = categories.DB;
