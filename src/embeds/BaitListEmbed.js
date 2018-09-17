const PaginationEmbed = require('./PaginationEmbed');
const EmptyListException = require('../exceptions/EmptyListException');
const { MessageEmbed } = require('discord.js');
const { emojis } = require('../config');
const {
    functions: { capitalizeFirstLetter, imageUrl },
    fileDb: { translate },
} = require('../util');

class BaitListEmbed extends PaginationEmbed {
    constructor (initialMessage, baits) {
        super(initialMessage);

        if (!baits.length) { throw new EmptyListException('Nothing to do with empty baits list'); }

        const embeds = baits.map((bait, idx, arr) => {
            const embed = new MessageEmbed()
                .setTitle(`${translate(bait.name)} (${bait.grade}★)`)
                .setDescription(translate(bait.description))
                .addField(`${capitalizeFirstLetter(bait.habitat)} bonus`, bait.habitat_bonus, true)
                .addField('Bite chance', bait.bite_chance, true)
                .addField('Big fish chance', bait.big_chance, true)
                .addField('Price', `${bait.price}${emojis.gold}`, true)
                .setFooter(`Page ${idx + 1}/${arr.length}`)
                .setThumbnail(imageUrl('fish/' + bait.image));

            return bait.event_chance ? embed.addField('Event bonus', bait.event_chance) : embed;
        });

        this.setArray(embeds).showPageIndicator(false);
    }
}

module.exports = BaitListEmbed;
