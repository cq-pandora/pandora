const PaginationEmbed = require('./PaginationEmbed');
const EmptyListException = require('../exceptions/EmptyListException');
const { MessageEmbed } = require('discord.js');
const {
    functions: { imageUrl },
    fileDb: { translate },
} = require('../util');

class BerriesListEmbed extends PaginationEmbed {
    constructor (initialMessage, champion, page) {
        super(initialMessage);

        const embeds = champion.forms.map((form, idx, arr) => {
            let base = new MessageEmbed()
                .setTitle(`${translate(champion.name)} (Lvl. ${form.grade})`)
                .setFooter(`Page ${idx + 1}/${arr.length}`);

            if (form.active) {
                base = base.addField(`${translate(form.active.name)} (Active)`, translate(form.active.description));
            }

            if (form.passive) {
                base = base.addField(`${translate(form.passive.name)} (Passive)`, translate(form.passive.description));
            }

            if (form.exclusive) {
                base = base.addField(`${translate(form.exclusive.name)} (Exclusive)`, translate(form.exclusive.description));
            }

            return base;
        });

        this.setArray(embeds)
            .showPageIndicator(false)
            .setThumbnail(imageUrl('heroes/' + champion.image))
            .setDescription(translate(champion.lore));

        if (page)
            this.setPage(page);
    }
}

module.exports = BerriesListEmbed;
