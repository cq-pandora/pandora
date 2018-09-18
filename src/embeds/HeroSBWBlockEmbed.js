const PaginationEmbed = require('./PaginationEmbed');
const { MessageEmbed } = require('discord.js');
const {
    functions: { imageUrl, splitText },
    fileDb: { translate },
} = require('../util');

const classColors = {
    archer: 0x79B21D,
    hunter: 0xDAA628,
    paladin: 0x24A2BF,
    priest: 0xF163B3,
    warrior: 0xB43026,
    wizard: 0x985ED5
};

class HeroFormsEmbed extends PaginationEmbed {
    constructor (initialMessage, hero, page) {
        super(initialMessage);

        const embeds = hero.sbws.map(sbw => {
            const form = hero.forms.filter(f => f.star === sbw.star)[0];
            let embed = new MessageEmbed()
                .setTitle(`${translate(form.name)} (${form.star}★)`)
                .setThumbnail(imageUrl('skills/' + form.block_image))
                .addField(`${translate(form.block_name)} (Lv. ${form.skill_lvl})`, translate(form.block_description));

            const abilityChunks = splitText(translate(form.passive_description));

            embed.addField(translate(form.passive_name), abilityChunks[0]);

            for (let i = 1; i < abilityChunks.length; i++) {
                embed = embed.addField('\u200b', abilityChunks[i]);
            }

            const sbwChunks = splitText(translate(sbw.ability));

            embed.addField('SBW effect', sbwChunks[0]);

            for (let i = 1; i < sbwChunks.length; i++) {
                embed = embed.addField('\u200b', sbwChunks[i]);
            }

            return embed;
        });

        this.setArray(embeds)
            .showPageIndicator(false)
            .setColor(classColors[hero.class]);

        if (page) {
            this.setPage(page);
        }
    }
}

module.exports = HeroFormsEmbed;
