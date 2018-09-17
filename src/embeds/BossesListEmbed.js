const PaginationEmbed = require('./PaginationEmbed');
const { MessageEmbed } = require('discord.js');
const {
    functions: { statsToString, imageUrl },
    fileDb: { translate },
} = require('../util');

class BerriesListEmbed extends PaginationEmbed {
    constructor (initialMessage, bosses) {
        super(initialMessage);

        const embeds = bosses.map(boss => new MessageEmbed()
            .setTitle(`${translate(boss.name)}`)
            .setDescription(statsToString(boss))
            .setThumbnail(imageUrl('heroes/' + boss.image))
        );

        this.setArray(embeds)
            .showPageIndicator(false);
    }
}

module.exports = BerriesListEmbed;
