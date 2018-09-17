const PaginationEmbed = require('./PaginationEmbed');
const EmptyListException = require('../exceptions/EmptyListException');
const { MessageEmbed } = require('discord.js');
const _ = require('lodash');
const {
    functions: { statsToString, imageUrl },
    fileDb: { translate },
} = require('../util');

class BerriesListEmbed extends PaginationEmbed {
    constructor (initialMessage, bosses) {
        super(initialMessage);

        if (!bosses.length) { throw new EmptyListException('Nothing to do without bosses'); }

        const embeds = bosses.map((boss, idx, arr) => new MessageEmbed()
            .setTitle(`${translate(boss.name)}`)
            .setDescription(statsToString(boss))
            .setThumbnail(imageUrl('heroes/' + boss.image))
            .setFooter(`Page ${idx + 1}/${arr.length}`)
        );

        this.setArray(embeds)
            .showPageIndicator(false);
    }
}

module.exports = BerriesListEmbed;
