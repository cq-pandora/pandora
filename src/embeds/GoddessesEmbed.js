const { MessageEmbed } = require('discord.js');

const PaginationEmbed = require('./PaginationEmbed');
const { imageUrl } = require('../functions');
const { fileDb: { translate } } = require('../util');

class GoddessesEmbed extends PaginationEmbed {
	constructor(initialMessage, goddesses) {
		super(initialMessage);

		if (!Array.isArray(goddesses)) {
			goddesses = [goddesses];
		}

		const embeds = goddesses.map(goddess => new MessageEmbed()
			.setTitle(translate(goddess.name))
			.addField(translate(goddess.skill_name), translate(goddess.skill_description))
			.setThumbnail(imageUrl(`heroes/${goddess.image}`)));

		this.setArray(embeds).showPageIndicator(false);
	}
}

module.exports = GoddessesEmbed;
