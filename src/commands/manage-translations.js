const { MessageEmbed } = require('discord.js');
const _ = require('lodash');
const translations = require('../db/translations');
const { getPrefix, splitText } = require('../functions');
const {
	fileDb: { heroesFuzzy, heroes, keysDescriptions },
	categories,
	cmdResult,
	PaginationEmbed,
} = require('../util');

const instructions = async (message) => {
	const prefix = getPrefix(message);

	const embed = {
		title: `${prefix}manage-translations <action> [<field>] [<name>] [<grade>] [<id>]`,
		fields: [
			{
				name: '<action>',
				value: 'Action to perform.\nCan be accept, decline, clear, list or list-all'
			},
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
				name: '<id>',
				value: 'ID of translations to accept or decline'
			}
		],
		footer: { text: 'Argument order matters!' }
	};

	await message.channel.send({ embed });

	return {
		status_code: cmdResult.NOT_ENOUGH_ARGS,
	};
};

const translationsToEmbeds = (ts) => {
	const embeds = [];

	let i = 0;
	for (const translationsChunk of _.chunk(ts, 10)) {
		const embed = new MessageEmbed()
			.setFooter(`Translations ${i * 10 + 1}-${i * 10 + translationsChunk.length}/${ts.length}`);

		for (const translation of translationsChunk) {
			let atFirst = true;

			for (const chunk of splitText(translation.text)) {
				embed.addField(
					atFirst
						? `${keysDescriptions[translation.key]}, ID: ${translation.id}`
						: '\u200b',
					chunk
				);

				atFirst = false;
			}
		}

		embeds.push(embed);

		i += 1;
	}

	return embeds;
};

const actions = {
	list: async (message, { key }) => {
		try {
			const list = translationsToEmbeds(await translations.list(key));

			if (!list.length) {
				await message.channel.send('No pending translations!');
				return;
			}

			const embed = new PaginationEmbed(message)
				.setArray(list)
				.setAuthorizedUsers([message.author.id])
				.setChannel(message.channel)
				.showPageIndicator(false)
				.build();

			await embed;
		} catch (error) {
			await message.channel.send('Unable to list submitted translations. Please, contact bot owner.');

			throw error;
		}
	},
	accept: async (message, { field }) => {
		try {
			await translations.accept(field);

			await message.channel.send('Translation accepted!');
		} catch (error) {
			await message.channel.send('Unable to accept translation. Please, contact bot owner.');

			throw error;
		}
	},
	decline: async (message, { field }) => {
		try {
			await translations.decline(field);

			await message.channel.send('Translation declined!');
		} catch (error) {
			await message.channel.send('Unable to decline translation. Please, contact bot owner.');

			throw error;
		}
	},
	clear: async (message, { key }) => {
		try {
			await translations.declineAllUnaccepted(key);

			await message.channel.send('Translation cleared!');
		} catch (error) {
			await message.channel.send('Unable to clear translations. Please, contact bot owner.');

			throw error;
		}
	}
};

actions['list-all'] = actions.list;

const command = async (message, [nameAction, field, name, gradeStr]) => {
	nameAction = nameAction.toLowerCase();
	const grade = Number(gradeStr) || undefined;

	const action = actions[nameAction];

	if (!action) {
		return {
			status_code: cmdResult.ENTITY_NOT_FOUND,
			target: 'action',
			arguments: JSON.stringify({
				action: nameAction,
				field,
				name,
				grade
			}),
		};
	}

	if (['accept', 'decline', 'list-all'].includes(nameAction)) {
		await action(message, {
			action: nameAction,
			field
		});

		return {
			status_code: cmdResult.SUCCESS,
			target: field,
			arguments: JSON.stringify({
				action: nameAction,
				field
			}),
		};
	}

	const [candidate] = heroesFuzzy.search(name);

	if (!candidate) {
		return {
			status_code: cmdResult.ENTITY_NOT_FOUND,
			target: 'hero',
		};
	}

	const hero = heroes[Number(candidate.path.split('.')[0])];

	let form = null;
	let sbw = null;
	if (action.includes('sbw')) {
		sbw = hero.sbws.find(f => f.star === grade);

		if (!sbw) {
			await message.channel.send('Soulbound weapon grade not found!');

			return {
				status_code: cmdResult.ENTITY_GRADE_NOT_FOUND,
				target: 'sbw',
			};
		}
	} else {
		form = hero.forms.find(f => f.star === grade);

		if (!form) {
			await message.channel.send('Hero grade not found!');

			return {
				status_code: cmdResult.ENTITY_GRADE_NOT_FOUND,
				target: 'hero',
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

	if (['list', 'clear'].includes(nameAction)) {
		await action(message, {
			action: nameAction,
			field,
			key
		});

		return {
			status_code: cmdResult.SUCCESS,
			target: key,
			arguments: JSON.stringify({
				action: nameAction,
				field,
				key
			})
		};
	}

	return {
		status_code: cmdResult.UNKNOWN_ERROR,
	};
};

exports.run = ({ message, args }) => (
	args.length < 1
		? instructions(message)
		: command(message, args)
);

exports.protected = true;
exports.category = categories.PROTECTED;
