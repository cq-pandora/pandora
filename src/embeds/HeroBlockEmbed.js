const { MessageEmbed } = require('discord.js');

const PaginationEmbed = require('./PaginationEmbed');
const { splitText, imageUrl } = require('../functions');
const { fileDb: { translate } } = require('../util');

const classColors = {
	archer: 0x79B21D,
	hunter: 0xDAA628,
	paladin: 0x24A2BF,
	priest: 0xF163B3,
	warrior: 0xB43026,
	wizard: 0x985ED5
};

class HeroBlockEmbed extends PaginationEmbed {
	constructor(initialMessage, hero, page) {
		super(initialMessage);

		const embeds = hero.forms.map((form) => {
			const embed = new MessageEmbed()
				.setTitle(`${translate(form.name)} (${form.star}★)`)
				.setThumbnail(imageUrl(`skills/${form.block_image}`))
				.addField(`${translate(form.block_name)} (Lv. ${form.skill_lvl})`, translate(form.block_description));

			const chunks = form.passive_name
				? splitText(translate(form.passive_description))
				: [];

			let atFirst = true;
			for (const chunk of chunks) {
				embed.addField(atFirst ? '\u200b' : translate(form.passive_name), chunk);

				atFirst = false;
			}

			return embed;
		});

		this.setArray(embeds)
			.showPageIndicator(false)
			.setColor(classColors[hero.class]);

		if (page) {
			this.setPage(page);
		}
	}
}

module.exports = HeroBlockEmbed;
