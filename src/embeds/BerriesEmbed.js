const { MessageEmbed } = require('discord.js');
const PaginationEmbed = require('./PaginationEmbed');

const { emojis } = require('../config');
const { capitalizeFirstLetter, imageUrl, toClearNumber } = require('../functions');
const { fileDb: { translate } } = require('../util');

class BerriesEmbed extends PaginationEmbed {
	constructor(initialMessage, berries) {
		super(initialMessage);

		if (!Array.isArray(berries)) {
			berries = [berries];
		}

		const embeds = berries.map(berry => new MessageEmbed()
			.setTitle(`${translate(berry.name)} (${berry.grade}★)`)
			.setThumbnail(imageUrl(`berries/${berry.image}`))
			.addField('Rarity', capitalizeFirstLetter(berry.rarity), true)
			.addField('Stat', capitalizeFirstLetter(berry.target_stat), true)
			.addField('Great rate', `${(100 * berry.great_chance)}%`, true)
			.addField('Stat value', berry.is_percentage ? `${(100 * berry.value)}%` : berry.value, true)
			.addField('Sell price', `${toClearNumber(berry.sell_cost)}${emojis.gold}`, true)
			.addField('Eat cost', `${toClearNumber(berry.eat_cost)}${emojis.gold}`, true));

		this.setArray(embeds).showPageIndicator(false);
	}
}

module.exports = BerriesEmbed;
