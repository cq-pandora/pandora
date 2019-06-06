const { categories, cmdResult } = require('../util');

exports.run = async ({ message, args }) => {
	const embed = {
		title: 'Useful Links',
		description: 'Visit the [Crusaders Quest Database (cqdb)](https://goo.gl/fdg6M8)!',
		fields: [
			{
				name: 'Guides',
				value: '[Hero skills/builds list](http://bit.ly/2NNDlbg)\n[Beginner and returning](http://bit.ly/CQNewRetGuide)\n[AFK](http://bit.ly/CQAfkGuide)',
				inline: true,
			},
			{
				name: 'Tier Lists',
				value: '[kamakiller\'s SS2 Overview](https://goo.gl/yPrKBR)\n[kamakiller\'s Tier List](http://bit.ly/cqkktier)',
				inline: true,
			},
			{
				name: 'Raid',
				value: '[kamakiller\'s Loki](http://bit.ly/CQLokiIncarnate)\n[kamakiller\'s Manacar](https://goo.gl/PbpKdG)\n[Manacar Comic](https://goo.gl/aJ8Yoy)',
				inline: true,
			},
			{
				name: 'Champions',
				value: '[Vyrlokar](https://goo.gl/M37qRm)',
				inline: true,
			},
			{
				name: 'How To Get',
				value: '[Monuments](https://goo.gl/e10jeA)\n[Lionel\'s skin](https://goo.gl/9BXBkD)\n[Himiko\'s skin](https://goo.gl/5yDbjr)',
				inline: true,
			},
			{
				name: 'Challenge',
				value: '[kamakiller](https://goo.gl/bkC85j)\n[Sigils list](http://bit.ly/2NCLFu9)',
				inline: true,
			},
			{
				name: 'LoPF',
				value: '[Nyaa](https://goo.gl/iqppI0)\n[Shintouyu](https://goo.gl/4i8nCb)\n[LoPF map](https://goo.gl/YtlDQH)',
				inline: true,
			},
			{
				name: 'Hasla Guides',
				value: '[Comics](https://goo.gl/HPsANc)\n[Season 2](https://goo.gl/UQdjhw)\n[Berry system](https://goo.gl/jbgmLa)\n[Math in CQ](https://goo.gl/D5vtS2)',
				inline: true,
			},
			{
				name: 'Miscellaneous',
				value: '[Leveling guide](https://i.redd.it/ya5mgw9xvfk01.jpg)\n[cq-assets](http://bit.ly/PandoraAssets)\n[block-map](http://bit.ly/CQBlockMap)',
				inline: true,
			},
		],
	};

	await message.channel.send({ embed });

	return {
		status_code: cmdResult.SUCCESS,
		target: 'links',
	};
};

exports.category = categories.UTIL;
