const { MessageEmbed } = require('discord.js');
const {
    fileDb: { heroesFuzzy, followPath, translate },
    functions: { getPrefix, capitalizeFirstLetter, imageUrl, parseGrade, parseQuery },
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
        title: `${prefix}hero [<name>] [<star>]`,
        fields: [
            {
                name: '<name>',
                value: `Get hero data.\n*e.g. ${prefix}hero lee*`
            }, {
                name: '<star>',
                value: `Filter heroes by <star>. If omitted, defaults to highest form.\n*e.g. ${prefix}hero lee 4*`
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
            }));
    }

    const hero = followPath(candidates[0].path);

    let form = null;

    if (grade) {
        form = hero.forms.filter(f => f.star === grade)[0];
    } else {
        form = hero.forms[hero.forms.length - 1];
    }

    if (!form) {
        return message.channel
            .send('Hero grade not found!')
            .then(m => ({
                status_code: cmdResult.ENTITY_GRADE_NOT_FOUND,
            }));
    }

    const page = hero.forms.indexOf(form) + 1;

    const embeds = hero.forms.map((form, idx, arr) => new MessageEmbed()
        .setTitle(`${translate(form.name)} (${form.star}★)`)
        .setDescription(translate(form.lore))
        .setThumbnail(imageUrl('heroes/' + form.image))
        .setFooter(`Page ${idx + 1}/${arr.length}`)
    );

    return new PaginationEmbed(message)
        .setArray(embeds)
        .setAuthorizedUsers([message.author.id])
        .setChannel(message.channel)
        .setPage(page)
        .showPageIndicator(false)
        .setColor(classColors[hero.class])
        .addField('Class', capitalizeFirstLetter(hero.class), true)
        .addField('Type', capitalizeFirstLetter(hero.type), true)
        .addField('Faction', (!hero.domain || hero.domain === 'NONEGROUP') ? '-' : translate(`TEXT_CHAMPION_DOMAIN_${hero.domain}`), true)
        .addField('Gender', capitalizeFirstLetter(hero.gender), true)
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
