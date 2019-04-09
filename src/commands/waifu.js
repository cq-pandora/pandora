const { random, imageUrl } = require('../functions');
const {
	categories,
	cmdResult,
	fileDb: { heroes }
} = require('../util');

exports.run = async ({ message }) => {
	const hero = heroes[random(0, heroes.length - 1)];

	await message.channel.send({
		embed: {
			image: {
				url: imageUrl(`heroes/${hero.forms[hero.forms.length - 1].image}`),
			},
			footer: {
				text: `${message.author.username}#${message.author.discriminator}`,
			}
		}
	});

	return {
		status_code: cmdResult.SUCCESS,
		target: 'waifu',
	};
};

exports.category = categories.MISC;
