const { MessageEmbed } = require('discord.js');

const PaginationEmbed = require('./PaginationEmbed');
const { capitalizeFirstLetter, imageUrl } = require('../functions');
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

		const embeds = hero.forms.map(form => (
			new MessageEmbed()
				.setTitle(`${translate(form.name)} (${form.star}★)`)
				.setDescription(translate(form.lore))
				.setThumbnail(imageUrl(`heroes/${form.image}`))
		));

		const faction = (!hero.domain || hero.domain === 'NONEGROUP')
			? '-'
			: translate(`TEXT_CHAMPION_DOMAIN_${hero.domain}`);

		this.setArray(embeds)
			.showPageIndicator(false)
			.setColor(classColors[hero.class])
			.addField('Class', capitalizeFirstLetter(hero.class), true)
			.addField('Type', capitalizeFirstLetter(hero.type), true)
			.addField('Faction', faction, true)
			.addField('Gender', capitalizeFirstLetter(hero.gender), true);

		if (page) {
			this.setPage(page);
		}
	}
}

module.exports = HeroFormsEmbed;
