const { getPrefix, parseGrade, parseQuery } = require('../functions');
const {
	fileDb: { spSkillsFuzzy, followPath },
	categories,
	cmdResult,
} = require('../util');
const SPSkillEmbed = require('../embeds/SPSkillEmbed');

const instructions = async (message) => {
	const prefix = getPrefix(message);

	const embed = {
		title: `${prefix}sp-skill <name> [<level>]`,
		fields: [
			{
				name: '<name>',
				value: 'Get special skill data.'
			},
			{
				name: '<level>',
				value: 'Filter skills by Level. If omitted, defaults to highest level'
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

	const [candidate] = spSkillsFuzzy.search(name);

	if (!candidate) {
		await message.channel.send('Skill not found!');

		return {
			status_code: cmdResult.ENTITY_NOT_FOUND,
			target: 'spskill',
		};
	}

	const skill = followPath(candidate.path);

	let form = null;
	if (grade) {
		form = skill.forms.find(f => f.level === grade);
	} else {
		form = skill.forms[skill.forms.length - 1];
	}

	if (!form) {
		await message.channel.send('No such level for this skill!');

		return {
			status_code: cmdResult.ENTITY_GRADE_NOT_FOUND,
			target: skill.id,
		};
	}

	const page = skill.forms.indexOf(form) + 1;

	const embed = new SPSkillEmbed(message, skill, page);

	await embed.send();

	return {
		status_code: cmdResult.SUCCESS,
		target: skill.id,
		arguments: JSON.stringify({ name, grade }),
	};
};

exports.run = ({ message, args }) => (
	!args.length
		? instructions(message)
		: command(message, args)
);

exports.category = categories.DB;
