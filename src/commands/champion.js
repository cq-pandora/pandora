const { getPrefix, parseGrade, parseQuery } = require('../functions');
const {
	fileDb: { championsFuzzy, followPath },
	categories,
	cmdResult,
} = require('../util');
const ChampionEmbed = require('../embeds/ChampionEmbed');

const instructions = async (message) => {
	const prefix = getPrefix(message);

	const embed = {
		title: `${prefix}champion <name> [<grade>]`,
		fields: [
			{
				name: '<name>',
				value: 'Get champion data'
			}, {
				name: '<grade>',
				value: 'Champion level. Defaults to highest possible'
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

	const [candidate] = championsFuzzy.search(name);

	if (!candidate) {
		await message.channel.send('Champion not found!');

		return {
			status_code: cmdResult.ENTITY_NOT_FOUND,
		};
	}

	const champ = followPath(candidate.path);

	let form = null;
	if (grade) {
		form = champ.forms.find(f => f.grade === grade);
	} else {
		form = champ.forms[champ.forms.length - 1];
	}

	if (!form) {
		await message.channel.send('Champ level not found!');

		return {
			status_code: cmdResult.ENTITY_GRADE_NOT_FOUND,
		};
	}

	const page = champ.forms.indexOf(form) + 1;

	const embed = new ChampionEmbed(message, champ, page);

	await embed.send();

	return {
		status_code: cmdResult.SUCCESS,
		target: champ.id,
		arguments: JSON.stringify({ name, grade }),
	};
};

exports.run = ({ message, args }) => (
	!args.length
		? instructions(message)
		: command(message, args)
);

exports.category = categories.DB;
