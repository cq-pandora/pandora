const { MessageEmbed } = require('discord.js');

const PaginationEmbed = require('./PaginationEmbed');
const { emojis } = require('../config');
const { statsToString, imageUrl, capitalizeFirstLetter, toClearNumber } = require('../functions');
const { fileDb: { translate, sigils: sigilz } } = require('../util');

class SigilsEmbed extends PaginationEmbed {
	constructor(initialMessage, sigils) {
		super(initialMessage);

		if (!Array.isArray(sigils)) {
			sigils = [sigils];
		}

		const embeds = sigils.map((sigil) => {
			const embed = new MessageEmbed()
				.setDescription(translate(sigil.description))
				.setTitle(`${translate(sigil.name)} (${sigil.grade}★)`)
				.setThumbnail(imageUrl(`sigils/${sigil.image}`));

			const stats = {};
			const totalStats = {};

			for (const key of Object.keys(sigil.stats)) {
				if (!sigil.stats[key]) {
					continue;
				}

				stats[key] = sigil.stats[key];
				totalStats[key] = sigil.stats[key];
			}

			embed.addField('Stats', statsToString(stats), true);

			if (sigil.set) {
				const otherStats = {};
				const otherPiece = sigilz.find(s => s.ingame_id === sigil.set.pair);

				for (const key of Object.keys(otherPiece.stats)) {
					if (!otherPiece.stats[key]) {
						continue;
					}

					if (!totalStats[key]) {
						totalStats[key] = 0;
					}

					totalStats[key] += otherPiece.stats[key];
					otherStats[key] = otherPiece.stats[key];
				}

				// FIXME somehow parse total stats with set effect

				embed
					.addField('Set effect', translate(sigil.set.effect), true)
					.addField('Other piece', translate(otherPiece.name), true)
					.addField('Other piece stats', statsToString(otherStats), true)
					.setFooter(`Set: ${translate(sigil.set.name)}`);
			}

			return embed.addBlankField()
				.addField('Sell price', `${toClearNumber(sigil.sell_cost)}${emojis.gold}`, true)
				.addField('Extract cost', `${toClearNumber(sigil.extract_cost)}${emojis.gold}`, true)
				.addField('Rarity', capitalizeFirstLetter(sigil.rarity), true);
		});

		this.setArray(embeds).showPageIndicator(false);
	}
}

module.exports = SigilsEmbed;
