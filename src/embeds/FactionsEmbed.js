const PaginationEmbed = require('./PaginationEmbed');
const { MessageEmbed } = require('discord.js');
const _ = require('lodash');
const {
    functions: { splitText, imageUrl },
    fileDb: { translate, heroes },
} = require('../util');

class BerriesListEmbed extends PaginationEmbed {
    constructor (initialMessage, factions) {
        super(initialMessage);

        if (!Array.isArray(factions)) { factions = [factions]; }

        const embeds = factions.map(faction => {
            const description = heroes
                .filter(h => h.domain === faction.ingame_id)
                .map(h => translate(h.forms[0].name));

            return _.reduce(
                splitText(description),
                (msg, chunk) => msg.addField('\u200b', chunk),
                new MessageEmbed()
                    .setTitle(translate(faction.name))
                    .setThumbnail(imageUrl('common/' + faction.image))
            );
        });

        this.setArray(embeds)
            .showPageIndicator(false);
    }
}

module.exports = BerriesListEmbed;
