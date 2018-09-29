const { MessageEmbed } = require('discord.js');

const PaginationEmbed = require('./PaginationEmbed');
const { imageUrl } = require('../functions');
const { fileDb: { translate } } = require('../util');

class BerriesListEmbed extends PaginationEmbed {
	constructor(initialMessage, champion, page) {
		super(initialMessage);

		const embeds = champion.forms.map((form) => {
			const embed = new MessageEmbed()
				.setTitle(`${translate(champion.name)} (Lvl. ${form.grade})`);

			if (form.active) {
				embed.addField(`${translate(form.active.name)} (Active)`, translate(form.active.description));
			}

			if (form.passive) {
				embed.addField(`${translate(form.passive.name)} (Passive)`, translate(form.passive.description));
			}

			if (form.exclusive) {
				embed.addField(`${translate(form.exclusive.name)} (Exclusive)`, translate(form.exclusive.description));
			}

			return embed;
		});

		this.setArray(embeds)
			.showPageIndicator(false)
			.setThumbnail(imageUrl(`heroes/${champion.image}`))
			.setDescription(translate(champion.lore));

		if (page) {
			this.setPage(page);
		}
	}
}

module.exports = BerriesListEmbed;
