const { sigilsFuzzy, sigils, translate } = require('../util/cq-data');
const { getPrefix, capitalizeFirstLetter, imageUrl, parseGrade, parseQuery, statsToString } = require('../util/shared');
const { MessageEmbed } = require('discord.js');
const categories = require('../util/categories');

const instructions = (message) => {
    const prefix = getPrefix(message);
    const e = {
        //        title: `${prefix}sigil [<name>] [<star>]`,
        title: `${prefix}sigil [<name>]`,
        fields: [
            {
                name: '<name>',
                value: `Get sigil data.\n*e.g. ${prefix}sigil refusal*`
            }
            /* {
                name: '<star>',
                value: `Filter sigil by <star>.\n*e.g. ${prefix}sigil refusal 1*`,
            }, */
        ]
    };

    message.channel.send({
        embed: e
    });
};

const command = (message, args) => {
    const grade = parseGrade(args);
    const name = parseQuery(args, [`${grade}`]);

    const candidates = sigilsFuzzy.search(name);

    if (!candidates.length) {
        return message.channel
            .send('Sigil not found!')
            .catch(error => console.log(error));
    }

    const sigil = grade ? candidates.map(c => sigils[c.path]).filter(b => b.grade === grade)[0]
        : sigils[candidates[0].path];

    if (!sigil) {
        return message.channel
            .send('Sigil grade not found!')
            .catch(error => console.log(error));
    }

    let embed = new MessageEmbed()
        .setDescription(translate(sigil.description))
        .setTitle(`${translate(sigil.name)} (${sigil.grade}★)`)
        .setThumbnail(imageUrl('sigils/' + sigil.image))
        .addField('Rarity', capitalizeFirstLetter(sigil.rarity), true)
        .addField('Sell price', sigil.sell_cost, true)
        .addField('Extract cost', sigil.extract_cost, true);

    let stats = {}; let totalStats = {};

    for (const key in sigil.stats) {
        if (!sigil.stats[key]) { continue; }

        stats[key] = sigil.stats[key];
        totalStats[key] = sigil.stats[key];
    }

    embed = embed.addField('Stats', statsToString(stats), true);

    if (sigil.set) {
        const otherPiece = sigils.filter(s => s.ingame_id === sigil.set.pair)[0];
        let otherStats = {};

        for (const key in otherPiece.stats) {
            if (!otherPiece.stats[key]) { continue; }

            if (!totalStats[key]) totalStats[key] = 0;
            totalStats[key] += otherPiece.stats[key];
            otherStats[key] = otherPiece.stats[key];
        }

        // FIXME somehow parse total stats with set effect

        embed = embed
            .addField('Other piece stats', statsToString(otherStats), true)
            .addField('Set effect', translate(sigil.set.effect), true)
            .setFooter(`Set: ${translate(sigil.set.name)}`);
    }

    return message.channel
        .send(embed)
        .catch(error => console.log(error));
};

exports.run = (message, args) => {
    if (!args.length) { return instructions(message); }

    return command(message, args);
};

exports.category = categories.DB;
