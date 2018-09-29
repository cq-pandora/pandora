const { MessageEmbed } = require('discord.js');

const PaginationEmbed = require('./PaginationEmbed');
const { statsToString, imageUrl } = require('../functions');
const { fileDb: { translate } } = require('../util');

class BerriesListEmbed extends PaginationEmbed {
	constructor(initialMessage, bosses) {
		super(initialMessage);

		if (!Array.isArray(bosses)) {
			bosses = [bosses];
		}

		const embeds = bosses.map(boss => new MessageEmbed()
			.setTitle(`${translate(boss.name)}`)
			.setDescription(statsToString(boss))
			.setThumbnail(imageUrl(`heroes/${boss.image}`)));

		this.setArray(embeds)
			.showPageIndicator(false);
	}
}

module.exports = BerriesListEmbed;
