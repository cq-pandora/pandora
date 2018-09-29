const { MessageEmbed } = require('discord.js');

const PaginationEmbed = require('./PaginationEmbed');
const { statsToString, imageUrl } = require('../functions');
const { fileDb: { translate } } = require('../util');
const { emojis } = require('../config');

const classColors = {
	archer: 0x79B21D,
	hunter: 0xDAA628,
	paladin: 0x24A2BF,
	priest: 0xF163B3,
	warrior: 0xB43026,
	wizard: 0x985ED5
};

class HeroBlockEmbed extends PaginationEmbed {
	constructor(initialMessage, hero) {
		super(initialMessage);

		const embeds = hero.skins.map(skin => (
			new MessageEmbed()
				.setTitle(translate(skin.name))
				.setDescription(statsToString(skin.stats))
				.setThumbnail(imageUrl(`heroes/${skin.image}`))
				.addField('Sell price', `${skin.cost}${emojis.gold}`, true)
		));

		this.setArray(embeds)
			.showPageIndicator(false)
			.setColor(classColors[hero.class]);
	}
}

module.exports = HeroBlockEmbed;
