const { MessageEmbed } = require('discord.js');

const PaginationEmbed = require('./PaginationEmbed');
const { splitText, imageUrl } = require('../functions');
const { fileDb: { translate, heroes } } = require('../util');

class BerriesListEmbed extends PaginationEmbed {
	constructor(initialMessage, factions) {
		super(initialMessage);

		if (!Array.isArray(factions)) {
			factions = [factions];
		}

		const embeds = factions.map((faction) => {
			const description = heroes
				.filter(h => h.domain === faction.ingame_id)
				.map(h => translate(h.forms[0].name));

			const embed = new MessageEmbed()
				.setTitle(translate(faction.name))
				.setThumbnail(imageUrl(`common/${faction.image}`));

			for (const chunk of splitText(description)) {
				embed.addField('\u200b', chunk);
			}

			return embed;
		});

		this.setArray(embeds)
			.showPageIndicator(false);
	}
}

module.exports = BerriesListEmbed;
