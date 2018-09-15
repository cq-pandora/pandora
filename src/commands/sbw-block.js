const { MessageEmbed } = require('discord.js');
const {
    fileDb: { heroesFuzzy, followPath, translate },
    functions: { getPrefix, splitText, imageUrl, parseGrade, parseQuery },
    categories,
    cmdResult,
    PaginationEmbed,
} = require('../util');

const classColors = {
    archer: 0x79B21D,
    hunter: 0xDAA628,
    paladin: 0x24A2BF,
    priest: 0xF163B3,
    warrior: 0xB43026,
    wizard: 0x985ED5
};

const instructions = (message) => {
    const prefix = getPrefix(message);
    const e = {
        title: `${prefix}sbw-block [<name>] [<star>]`,
        fields: [{
            name: '<name>',
            value: `Get passive and sbw data.\n*e.g. ${prefix}sbw-block lee*`
        },
        {
            name: '<star>',
            value: `Filter sbw by <star>. If omitted, defaults to highest form.\n*e.g. ${prefix}sbw-block lee 4*`
        }
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

    const candidates = heroesFuzzy.search(name);

    if (!candidates.length) {
        return message.channel
            .send('Hero not found!')
            .then(m => ({
                status_code: cmdResult.ENTITY_NOT_FOUND,
                target: 'hero',
            }));
    }

    const hero = followPath(candidates[0].path);

    let sbw = null;
    let form = null;

    if (grade) {
        sbw = hero.sbws.filter(f => f.star === grade)[0];
        form = hero.forms.filter(f => f.star === grade)[0];
    } else {
        sbw = hero.sbws[hero.sbws.length - 1];
        form = hero.forms.filter(f => f.star === sbw.star)[0];
    }

    if (!sbw) {
        return message.channel
            .send('Soulbound weapon grade not found!')
            .then(m => ({
                status_code: cmdResult.ENTITY_GRADE_NOT_FOUND,
                target: 'sbw',
                arguments: { name: name, grade: grade },
            }));
    }

    const page = hero.sbws.indexOf(sbw) + 1;

    const embeds = hero.sbws.map((sbw, idx, arr) => {
        let embed = new MessageEmbed()
            .setTitle(`${translate(form.name)} (${form.star}★)`)
            .setThumbnail(imageUrl('skills/' + form.block_image))
            .addField(`${translate(form.block_name)} (Lv. ${form.skill_lvl})`, translate(form.block_description))
            .setFooter(`Page ${idx + 1}/${arr.length}`);

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

    return new PaginationEmbed(message)
        .setArray(embeds)
        .setAuthorizedUsers([message.author.id])
        .setChannel(message.channel)
        .setPage(page)
        .showPageIndicator(false)
        .setColor(classColors[hero.class])
        .build()
        .then(m => ({
            status_code: cmdResult.SUCCESS,
            target: hero.id,
            arguments: JSON.stringify({ name: name, grade: grade }),
        }));
};

exports.run = (message, args) => {
    if (!args.length) { return instructions(message); }

    return command(message, args);
};

exports.category = categories.DB;
