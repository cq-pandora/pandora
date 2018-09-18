const PaginationEmbed = require('./PaginationEmbed');
const { MessageEmbed } = require('discord.js');
const _ = require('lodash');
const {
    functions: { splitText, imageUrl },
    fileDb: { translate },
} = require('../util');

class PortraitsListEmbed extends PaginationEmbed {
    constructor (initialMessage, portraits, page) {
        super(initialMessage);

        const embeds = portraits.map(portrait =>
            new MessageEmbed()
                .setImage(imageUrl('portraits/' + portrait))
        );

        this.setArray(embeds)
            .showPageIndicator(false);

        if (page) {
            this.setPage(page);
        }
    }
}

module.exports = PortraitsListEmbed;
