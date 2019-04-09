const { getPrefix, parseGrade, parseQuery } = require('../functions');
const {
	fileDb: { heroesFuzzy, followPath },
	categories,
	cmdResult,
} = require('../util');
const HeroSBWEmbed = require('../embeds/HeroSBWEmbed');

const instructions = async (message) => {
	const prefix = getPrefix(message);

	const embed = {
		title: `${prefix}sbw [<name>] [<star>]`,
		fields: [
			{
				name: '<name>',
				value: `Get sbw data.\n*e.g. ${prefix}sbw lee*`
			},
			{
				name: '<star>',
				value: `Filter heroes by <star>. If omitted, defaults to highest form.\n*e.g. ${prefix}sbw lee 4*`
			}
		]
	};

	await message.channel.send({ embed });

	return {
		status_code: cmdResult.NOT_ENOUGH_ARGS,
	};
};

const command = async (message, args) => {
	const grade = parseGrade(args);
	const name = parseQuery(args, [`${grade}`]);

	const [candidate] = heroesFuzzy.search(name);

	if (!candidate) {
		await message.channel.send('Hero not found!');

		return {
			status_code: cmdResult.ENTITY_NOT_FOUND,
			target: 'hero',
		};
	}

	const hero = followPath(candidate.path);

	let sbw = null;
	if (grade) {
		sbw = hero.sbws.find(f => f.star === grade);
	} else {
		sbw = hero.sbws[hero.sbws.length - 1];
	}

	if (!sbw) {
		await message.channel.send('Soulbound weapon grade not found!');

		return {
			status_code: cmdResult.ENTITY_GRADE_NOT_FOUND,
			target: 'sbw',
		};
	}

	const page = hero.sbws.indexOf(sbw) + 1;

	const embed = new HeroSBWEmbed(message, hero, page);

	await embed.send();

	return {
		status_code: cmdResult.SUCCESS,
		target: hero.id,
		arguments: JSON.stringify({ name, grade }),
	};
};

exports.run = ({ message, args }) => (
	!args.length
		? instructions(message)
		: command(message, args)
);

exports.category = categories.DB;
