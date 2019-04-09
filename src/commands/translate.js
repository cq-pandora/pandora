const translations = require('../db/translations');
const { getPrefix } = require('../functions');
const {
	fileDb: { heroesFuzzy, followPath },
	categories,
	cmdResult,
} = require('../util');

const instructions = async (message) => {
	const prefix = getPrefix(message);

	const embed = {
		title: `${prefix}translate <field> <name> <grade> <translation>`,
		fields: [
			{
				name: '<field>',
				value: 'Field to translate.\nCan be block-name, block-description, passive-name, passive-description, lore, name, sbw-name or sbw-ability'
			},
			{
				name: '<name>',
				value: 'Hero name.\n**Important**: this should be single word, so test if bot can find what you want to translate by that word'
			},
			{
				name: '<grade>',
				value: 'SBW or hero grade'
			},
			{
				name: '<translation>',
				value: 'Full translation text as last parameter'
			}
		],
		footer: { text: 'Argument order matters!' }
	};

	await message.channel.send({ embed });

	return {
		status_code: cmdResult.NOT_ENOUGH_ARGS,
	};
};

const command = async (message, args) => {
	const [field, name, gradeStr] = args;
	const grade = Number(gradeStr);

	const [candidate] = heroesFuzzy.search(name);

	if (!candidate) {
		await message.channel.send('Hero not found!');

		return {
			status_code: cmdResult.ENTITY_NOT_FOUND,
			target: 'hero',
		};
	}

	const hero = followPath(candidate.path);

	let form = null;
	let sbw = null;
	if (field.includes('sbw')) {
		sbw = hero.sbws.find(f => f.star === grade);

		if (!sbw) {
			await message.channel.send('Soulbound weapon grade not found!');

			return {
				status_code: cmdResult.ENTITY_GRADE_NOT_FOUND,
				target: sbw.id,
			};
		}
	} else {
		form = hero.forms.find(f => f.star === grade);

		if (!form) {
			await message.channel.send('Hero grade not found!');

			return {
				status_code: cmdResult.ENTITY_GRADE_NOT_FOUND,
				target: hero.id,
			};
		}
	}

	let key;
	switch (field) {
	case 'block-name': key = form.block_name; break;
	case 'block-description': key = form.block_description; break;
	case 'passive-name': key = form.passive_name; break;
	case 'passive-description': key = form.passive_description; break;
	case 'lore': key = form.lore; break;
	case 'name': key = form.name; break;
	case 'sbw-name': key = sbw.name; break;
	case 'sbw-ability': key = sbw.ability; break;
	default: key = null;
	}

	if (!key) {
		await message.channel.send('Unknown field!');

		return {
			status_code: cmdResult.ENTITY_NOT_FOUND,
			target: 'field',
		};
	}

	const text = args.splice(3).filter(Boolean).join(' ');

	try {
		await translations.submit(key, text);

		await message.channel.send('Translation request submited!\nThanks for trying to make translations clearer');
	} catch (error) {
		await message.channel.send('Unable to submit your transltion. Please, contact bot owner.');

		throw error;
	}

	return {
		status_code: cmdResult.SUCCESS,
		target: hero ? hero.id : sbw.id,
		arguments: JSON.stringify({
			field, name, grade, text
		}),
	};
};

exports.run = ({ message, args }) => (
	args.length < 4
		? instructions(message)
		: command(message, args)
);

exports.category = categories.UTIL;
