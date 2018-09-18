const PaginationEmbed = require('./PaginationEmbed');
const { MessageEmbed } = require('discord.js');
const { emojis } = require('../config');
const {
    functions: { capitalizeFirstLetter, imageUrl },
    fileDb: { translate },
} = require('../util');

const rewards = {
    ITEM_FISHCOIN: emojis.fishcoin,
    ITEM_GOLD: emojis.gold,
    RANDOMBOX_EVENT_GOOD_CATBOX: emojis.mossy_cat_chest,
    RANDOMBOX_EVENT_NORMAL_CATBOX: emojis.intact_cat_chest,
};

class FishListEmbed extends PaginationEmbed {
    constructor (initialMessage, fishes) {
        super(initialMessage);

        const embeds = fishes.map(fish =>
            new MessageEmbed()
                .setTitle(`${translate(fish.name)} (${fish.grade}★)`)
                .setDescription(translate(fish.description))
                .addField('Exp', fish.exp, true)
                .addField('Area type', capitalizeFirstLetter(fish.habitat), true)
                .addField('Initial range', `${fish.starts_from}m`, true)
                .addField(`Reward${fish.rewards.length > 1 ? 's' : ''}`,
                    fish.rewards.map(r => `${r.amount > 1 ? r.amount : ''} ${rewards[r.type]}`).join('\n'),
                    true
                )
                .setThumbnail(imageUrl('fish/' + fish.image))
        );

        this.setArray(embeds).showPageIndicator(false);
    }
}

module.exports = FishListEmbed;
