const PaginationEmbed = require('./PaginationEmbed');
const { MessageEmbed } = require('discord.js');
const { emojis } = require('../config');
const {
    functions: { capitalizeFirstLetter, imageUrl, toClearNumber },
    fileDb: { translate },
} = require('../util');

class BerriesListEmbed extends PaginationEmbed {
    constructor (initialMessage, berries) {
        super(initialMessage);

        const embeds = berries.map(berry => new MessageEmbed()
            .setTitle(`${translate(berry.name)} (${berry.grade}★)`)
            .setThumbnail(imageUrl('berries/' + berry.image))
            .addField('Rarity', capitalizeFirstLetter(berry.rarity), true)
            .addField('Stat', capitalizeFirstLetter(berry.target_stat), true)
            .addField('Great rate', `${(100 * berry.great_chance)}%`, true)
            .addField('Stat value', berry.is_percentage ? `${(100 * berry.value)}%` : berry.value, true)
            .addField('Sell price', `${toClearNumber(berry.sell_cost)}${emojis.gold}`, true)
            .addField('Eat cost', `${toClearNumber(berry.eat_cost)}${emojis.gold}`, true)
        );

        this.setArray(embeds).showPageIndicator(false);
    }
}

module.exports = BerriesListEmbed;
