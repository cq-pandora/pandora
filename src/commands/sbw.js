const { Embeds: EmbedsMode } = require('discord-paginationembed');
const { MessageEmbed } = require('discord.js');
const {
    fileDb: { heroesFuzzy, heroes, translate },
    functions: { getPrefix, textSplitter, capitalizeFirstLetter, imageUrl, parseGrade, parseQuery },
    categories,
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
        title: `${prefix}sbw [<name>] [<star>]`,
        fields: [{
            name: '<name>',
            value: `Get sbw data.\n*e.g. ${prefix}sbw lee*`
        },
        {
            name: '<star>',
            value: `Filter heroes by <star>. If omitted, defaults to highest form.\n*e.g. ${prefix}sbw lee 4*`
        }
        ]
    };

    message.channel.send({ embed: e });
};

const command = (message, args) => {
    const grade = parseGrade(args);
    const name = parseQuery(args, [`${grade}`]);

    const candidates = heroesFuzzy.search(name);

    if (!candidates.length) {
        return message.channel
            .send('Hero not found!')
            .catch(error => console.log(error));
    }

    const hero = heroes[candidates.map(c => parseInt(c.path.split('.')[0]))[0]];

    let sbw = null;

    if (grade) {
        sbw = hero.sbws.filter(f => f.star === grade)[0];
    } else {
        sbw = hero.sbws[hero.sbws.length - 1];
    }

    if (!sbw) {
        return message.channel
            .send('Soulbound weapon grade not found!')
            .catch(error => console.log(error));
    }

    const page = hero.sbws.indexOf(sbw) + 1;

    const embeds = hero.sbws.map((sbw, idx, arr) => {
        const abilityChunks = textSplitter(translate(sbw.ability));
        let embed = new MessageEmbed()
            .setTitle(`${translate(sbw.name)} (${sbw.star}★)`)
            .setThumbnail(imageUrl('weapons/' + sbw.image))
            .setFooter(`Page ${idx + 1}/${arr.length}`);

        for (const i in abilityChunks) {
            embed = embed.addField('\u200b', abilityChunks[i]);
        }

        return embed
            .addField('Class', capitalizeFirstLetter(sbw.class), true)
            // .addField('Range', capitalizeFirstLetter(sb.range), true)
            .addField('Attack power', sbw.atk_power, true)
            .addField('Attack speed', sbw.atk_speed, true);
    });

    return new EmbedsMode()
        .setArray(embeds)
        .setAuthorizedUsers([message.author.id])
        .setChannel(message.channel)
        .setPage(page)
        .showPageIndicator(false)
        .setDisabledNavigationEmojis(['JUMP'])
        .setColor(classColors[hero.class])
        .build();
};

exports.run = (message, args) => {
    if (!args.length) { return instructions(message); }

    return command(message, args);
};

exports.category = categories.DB;
