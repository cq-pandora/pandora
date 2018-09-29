const { MessageEmbed } = require('discord.js');

const PaginationEmbed = require('./PaginationEmbed');
const { imageUrl, splitText } = require('../functions');
const { fileDb: { translate } } = require('../util');

const classColors = {
	archer: 0x79B21D,
	hunter: 0xDAA628,
	paladin: 0x24A2BF,
	priest: 0xF163B3,
	warrior: 0xB43026,
	wizard: 0x985ED5
};

class HeroFormsEmbed extends PaginationEmbed {
	constructor(initialMessage, hero, page) {
		super(initialMessage);

		const embeds = hero.sbws.map((sbw) => {
			const form = hero.forms.find(f => f.star === sbw.star);

			const embed = new MessageEmbed()
				.setTitle(`${translate(form.name)} (${form.star}★)`)
				.setThumbnail(imageUrl(`skills/${form.block_image}`))
				.addField(`${translate(form.block_name)} (Lv. ${form.skill_lvl})`, translate(form.block_description));

			const abilityChunks = splitText(translate(form.passive_description));

			embed.addField(translate(form.passive_name), abilityChunks.shift());

			for (const abilityChunk of abilityChunks) {
				embed.addField('\u200b', abilityChunk);
			}

			const sbwChunks = splitText(translate(sbw.ability));

			embed.addField('SBW effect', sbwChunks.shift());

			for (const sbwChunk of sbwChunks) {
				embed.addField('\u200b', sbwChunk);
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

module.exports = HeroFormsEmbed;
