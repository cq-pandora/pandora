const _ = require('lodash');
const { MessageAttachment, MessageEmbed } = require('discord.js');

const {
	random,
	makeInRange,
	makePullImage,
	pickGrade,
	formatPullChunks,
	arrayToObjectWithIdAsKeyReducer,
	chancesRoll,
} = require('../functions');
const {
	categories,
	cmdResult,
	fileDb: { heroes }
} = require('../util');

const reZeroPool = {
	CHA_WI_LIMITED_RZ_4_05: 1,
	CHA_PA_LIMITED_RZ_4_03: 1,
	CHA_PR_LIMITED_RZ_4_07: 3,
	CHA_WA_LIMITED_RZ_4_02: 3,
	CHA_WI_LIMITED_RZ_4_04: 3,
	CHA_WI_LIMITED_RZ_4_06: 3,
};

const gg1Pool = {
	CHA_WI_LIMITED_GG_4_1: 1,
	CHA_WA_LIMITED_GG_4_2: 1,
	CHA_HU_LIMITED_GG_4_1: 3,
	CHA_PR_LIMITED_GG_4_1: 3,
	CHA_WA_LIMITED_GG_4_1: 3,
	CHA_PA_LIMITED_GG_4_1: 3,
	CHA_AR_LIMITED_GG_4_1: 3,
};

const gg2Pool = {
	CHA_WI_LIMITED_GG3_4_DIZZY: 1,
	CHA_WA_LIMITED_GG_4_4: 1,
	CHA_WA_LIMITED_GG3_4_BAIKEN: 3,
	CHA_WA_LIMITED_GG_4_3: 3,
	CHA_PA_LIMITED_GG_4_2: 3,
	CHA_WI_LIMITED_GG_4_2: 3,
};

const gsPool = {
	CHA_PA_LIMITED_GS_4_02: 1,
	CHA_WA_LIMITED_GS_4_01: 1,
	CHA_AR_LIMITED_GS_4_06: 2.4,
	CHA_PR_LIMITED_GS_4_03: 2.4,
	CHA_PR_LIMITED_GS_4_04: 2.4,
	CHA_WA_LIMITED_GS_4_07: 2.4,
	CHA_WI_LIMITED_GS_4_05: 2.4,
};

const shPool = {
	CHA_PA_LIMITED_SH_4_02: 1,
	CHA_PA_LIMITED_SH_4_03: 3,
	CHA_WA_LIMITED_SH_4_01: 1,
	CHA_WI_LIMITED_SH_4_04: 3,
	CHA_WI_LIMITED_SH_4_05: 3,
	CHA_WI_LIMITED_SH_4_06: 3,
};

const HEROES_HIDDEN = [
	'legendary',
	'support',
	// 'secret'
];

const forms = _.flatten(heroes
	.filter(hero => hero.type && !HEROES_HIDDEN.includes(hero.type))
	.map(hero => (
		hero.forms.map((form) => {
			form.hero = hero;

			return form;
		})
	)));

const secretForms = forms.filter(f => f.hero.type === 'secret' || f.hero.type === 'collab');
const plainForms = forms.filter(f => f.hero.type !== 'secret' && f.hero.type !== 'collab');

const secretFormsById = secretForms.reduce(arrayToObjectWithIdAsKeyReducer, {});

const sortedForms = {};

for (const key of [3, 4, 5, 6]) {
	sortedForms[key] = plainForms.filter(form => (
		Number(form.star) === key
	));
}

sortedForms.guaranteed = sortedForms[4].filter(f => f.hero.type === 'contract');

const ggPull = (count, chances) => Array(count)
	.fill()
	.map((_, idx) => {
		if ((1 + idx) % 10) {
			const grade = pickGrade({ 4: 0.17 }, 3);

			if (grade === 3) {
				return sortedForms[3][random(0, sortedForms[3].length - 1)];
			}

			const form = chancesRoll(chances);

			return secretFormsById[form];
		}

		const form = chancesRoll(chances);

		return secretFormsById[form];
	});

const pulls = {
	gg1: count => ggPull(count, gg1Pool),
	gg2: count => ggPull(count, gg2Pool),
	rz: count => ggPull(count, reZeroPool),
	sh: count => ggPull(count, shPool),
	contract: count => Array(count)
		.fill()
		.map((_, idx) => {
			if ((1 + idx) % 10) {
				const grade = pickGrade();

				return sortedForms[grade][random(0, sortedForms[grade].length - 1)];
			}
			return sortedForms.guaranteed[random(0, sortedForms.guaranteed.length - 1)];
		}),
	gs: count => ggPull(count, gsPool),
};

const command = async (message, [pullType, pullCount]) => {
	if (typeof pullType === 'undefined' || !Number.isNaN(Number(pullType))) {
		pullCount = pullType;
		pullType = 'contract';
	}

	const puller = pulls[pullType];

	if (!puller) {
		await message.channel.send(`Unknown pull type. Can be ${Object.getOwnPropertyNames(pulls).join(', ')}!`);
		return {
			status_code: cmdResult.ENTITY_NOT_FOUND,
			target: 'pull',
			arguments: JSON.stringify({ pullType, pullCount }),
		};
	}

	pullCount = makeInRange((Number(pullCount) || 10), 1, 20);

	const pull = puller(pullCount);

	const canvas = await makePullImage(pull);

	const chunks = formatPullChunks(pull);

	const embed = new MessageEmbed()
		.setAuthor(`${message.author.username}#${message.author.discriminator}`, message.author.avatarURL)
		.setImage('attachment://pull.png');

	for (const chunk of chunks) {
		embed.addField('\u200b', chunk.join('\n'));
	}

	await message.channel.send({
		embed,
		files: [
			new MessageAttachment(await canvas.getBufferAsync('image/png'), 'pull.png')
		]
	});

	return {
		status_code: cmdResult.SUCCESS,
		target: 'pull',
		arguments: JSON.stringify({ pullType, pullCount }),
	};
};

exports.run = ({ message, args }) => command(message, args);

exports.category = categories.MISC;
