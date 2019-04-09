const { getPrefix, parseGrade, parseQuery } = require('../functions');
const {
	fileDb: { heroesFuzzy, followPath },
	categories,
	cmdResult,
} = require('../util');
const HeroFormsEmbed = require('../embeds/HeroFormsEmbed');

const instructions = async (message) => {
	const prefix = getPrefix(message);
	const embed = {
		title: `${prefix}hero [<name>] [<star>]`,
		fields: [
			{
				name: '<name>',
				value: `Get hero data.\n*e.g. ${prefix}hero lee*`
			}, {
				name: '<star>',
				value: `Filter heroes by <star>. If omitted, defaults to highest form.\n*e.g. ${prefix}hero lee 4*`
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
		};
	}

	const hero = followPath(candidate.path);

	let form = null;
	if (grade) {
		form = hero.forms.find(f => f.star === grade);
	} else {
		form = hero.forms[hero.forms.length - 1];
	}

	if (!form) {
		await message.channel.send('Hero grade not found!');

		return {
			status_code: cmdResult.ENTITY_GRADE_NOT_FOUND,
		};
	}

	const page = hero.forms.indexOf(form) + 1;

	const embed = new HeroFormsEmbed(message, hero, page);

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
