const PaginationEmbed = require('./PaginationEmbed');
const { MessageEmbed } = require('discord.js');
const {
    functions: { statsToString, imageUrl, sumStats },
    fileDb: { translate, inheritance },
} = require('../util');

const classColors = {
    archer: 0x79B21D,
    hunter: 0xDAA628,
    paladin: 0x24A2BF,
    priest: 0xF163B3,
    warrior: 0xB43026,
    wizard: 0x985ED5
};

class HeroBlockEmbed extends PaginationEmbed {
    constructor (initialMessage, hero, inherits) {
        super(initialMessage);

        if (!Array.isArray(inherits))
            inherits = [inherits];

        const form = hero.forms.filter(f => f.star === 6)[0];
        const maxBerry = sumStats(form.max_berries, form);

        const embeds = inherits.map(inheritLvl => new MessageEmbed()
            .setTitle(`${translate(form.name)} (${inheritLvl === 0 ? '+Berry' : `Lv. ${inheritLvl}`})`)
            .setDescription(statsToString(
                inheritLvl !== 0 ? sumStats(inheritance[hero.class][inheritLvl], maxBerry) : maxBerry
            ))
            .setThumbnail(imageUrl('heroes/' + form.image))
        );

        this.setArray(embeds)
            .showPageIndicator(false)
            .setColor(classColors[hero.class]);
    }
}

module.exports = HeroBlockEmbed;
