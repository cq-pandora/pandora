const { MessageEmbed } = require('discord.js');
const {
    fileDb: { heroesFuzzy, heroes, translate, inheritance },
    functions: { getPrefix, imageUrl, parseQuery, parseInheritance, sumStats, statsToString },
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
        title: `${prefix}inherit [<name>] [<inheritance level>]`,
        fields: [
            {
                name: '<name>',
                value: `Get hero inheritance stats.\n*e.g. ${prefix}hero lee*`
            },
            {
                name: '<inheritance level>',
                value: `Get hero specific inheritance level stats.\n*e.g. ${prefix}hero lee 7*`
            }
        ]
    };

    return message.channel.send({ embed: e })
        .then(m => ({
            status_code: cmdResult.NOT_ENOUGH_ARGS,
        }));
};

const command = (message, args) => {
    const iLvl = parseInheritance(args);
    const name = parseQuery(args, [iLvl]);

    const candidates = heroesFuzzy.search(name);

    if (!candidates.length) {
        return message.channel
            .send('Hero not found!')
            .then(m => ({
                status_code: cmdResult.ENTITY_NOT_FOUND,
            }));
    }

    const hero = heroes[candidates.map(c => parseInt(c.path.split('.')[0]))[0]];
    const form = hero.forms.filter(f => f.star === 6)[0];

    if (!form) {
        return message.channel
            .send('Hero cannot be inherited!')
            .then(m => ({
                status_code: cmdResult.ENTITY_GRADE_NOT_FOUND,
            }));
    }

    const levels = (iLvl || iLvl === 0) ? [iLvl] : [0, 5, 10, 15, 20];
    const maxBerry = sumStats(form.max_berries, form);

    const embeds = levels.map((inheritLvl, idx, arr) => new MessageEmbed()
        .setTitle(`${translate(form.name)} (${inheritLvl === 0 ? '+MAXBERRY' : `Lv. ${inheritLvl}`})`)
        .setDescription(statsToString(
            inheritLvl !== 0 ? sumStats(inheritance[hero.class][inheritLvl], maxBerry) : maxBerry
        ))
        .setThumbnail(imageUrl('heroes/' + form.image))
        .setFooter(`Page ${idx + 1}/${arr.length}`)
    );

    return new PaginationEmbed(message)
        .setArray(embeds)
        .setAuthorizedUsers([message.author.id])
        .setChannel(message.channel)
        .showPageIndicator(false)
        .setColor(classColors[hero.class])
        .build()
        .then(m => ({
            status_code: cmdResult.SUCCESS,
            target: hero.id,
            arguments: JSON.stringify({ name: name, inheritance: iLvl }),
        }));
};

exports.run = (message, args) => {
    if (!args.length) { return instructions(message); }

    return command(message, args);
};

exports.category = categories.DB;
