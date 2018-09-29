const { MessageEmbed } = require('discord.js');

const PaginationEmbed = require('./PaginationEmbed');
const { emojis } = require('../config');
const { capitalizeFirstLetter, imageUrl, toClearNumber } = require('../functions');
const { fileDb: { translate } } = require('../util');

const currencies = {
	ITEM_FISHCOIN: emojis.fishcoin,
	ITEM_GOLD: emojis.gold,
	ITEM_HONOR: emojis.honor,
	ITEM_JEWEL: emojis.gem,
};

class FishingGearsEmbed extends PaginationEmbed {
	constructor(initialMessage, gears) {
		super(initialMessage);

		if (!Array.isArray(gears)) {
			gears = [gears];
		}

		const embeds = gears.map((gear) => {
			const embed = new MessageEmbed()
				.setTitle(`${translate(gear.name)} (${gear.grade}★)`)
				.setDescription(translate(gear.description))
				.addField(`${capitalizeFirstLetter(gear.habitat)} bonus`, gear.habitat_bonus, true)
				.addField('Bite chance', gear.bite_chance, true)
				.addField('Big fish chance', gear.big_chance, true)
				.addField('Price', `${toClearNumber(gear.price)}${currencies[gear.currency]}`, true)
				.setThumbnail(imageUrl(`fish/${gear.image}`));

			if (gear.event_chance) {
				embed.addField('Event bonus', gear.event_chance);
			}

			return embed;
		});

		this.setArray(embeds).showPageIndicator(false);
	}
}

module.exports = FishingGearsEmbed;
