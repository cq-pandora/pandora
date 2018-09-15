const { MessageEmbed } = require('discord.js');
const {
    fileDb: { sigilsFuzzy, followPath, sigils, translate },
    functions: { getPrefix, capitalizeFirstLetter, imageUrl, parseGrade, parseQuery, statsToString },
    categories,
    cmdResult,
} = require('../util');

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

    return message.channel.send({ embed: e })
        .then(m => ({
            status_code: cmdResult.NOT_ENOUGH_ARGS,
        }));
};

const command = (message, args) => {
    const grade = parseGrade(args);
    const name = parseQuery(args, [`${grade}`]);

    const candidates = sigilsFuzzy.search(name);

    if (!candidates.length) {
        return message.channel
            .send('Sigil not found!')
            .then(m => ({
                status_code: cmdResult.ENTITY_NOT_FOUND,
                target: 'sigil',
            }));
    }

    const sigil = grade ? candidates.map(c => followPath(c.path)).filter(b => b.grade === grade)[0]
        : followPath(candidates[0].path);

    if (!sigil) {
        return message.channel
            .send('Sigil grade not found!')
            .then(m => ({
                status_code: cmdResult.ENTITY_GRADE_NOT_FOUND,
                target: sigil.id,
            }));
    }

    let embed = new MessageEmbed()
        .setDescription(translate(sigil.description))
        .setTitle(`${translate(sigil.name)} (${sigil.grade}★)`)
        .setThumbnail(imageUrl('sigils/' + sigil.image));

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
            .addField('Set effect', translate(sigil.set.effect), true)
            .addField('Other piece', translate(otherPiece.name), true)
            .addField('Other piece stats', statsToString(otherStats), true)
            .setFooter(`Set: ${translate(sigil.set.name)}`);
    }

    return message.channel
        .send(embed
            .addBlankField()
            .addField('Sell price', sigil.sell_cost, true)
            .addField('Extract cost', sigil.extract_cost, true)
            .addField('Rarity', capitalizeFirstLetter(sigil.rarity), true)
        )
        .then(m => ({
            status_code: cmdResult.SUCCESS,
            target: sigil.id,
            arguments: JSON.stringify({ name: name, grade: grade }),
        }));
};

exports.run = (message, args) => {
    if (!args.length) { return instructions(message); }

    return command(message, args);
};

exports.category = categories.DB;
