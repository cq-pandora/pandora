const { MessageEmbed } = require('discord.js');

const PaginationEmbed = require('./PaginationEmbed');
const { capitalizeFirstLetter, imageUrl, splitText } = require('../functions');
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
			const embed = new MessageEmbed()
				.setTitle(`${translate(sbw.name)} (${sbw.star}★)`)
				.setThumbnail(imageUrl(`weapons/${sbw.image}`));

			const abilityChunks = splitText(translate(sbw.ability));

			for (const abilityChunk of abilityChunks) {
				embed.addField('\u200b', abilityChunk);
			}

			return embed
				.addField('Class', capitalizeFirstLetter(sbw.class), true)
			// .addField('Range', capitalizeFirstLetter(sb.range), true)
				.addField('Attack power', sbw.atk_power, true)
				.addField('Attack speed', sbw.atk_speed, true);
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
