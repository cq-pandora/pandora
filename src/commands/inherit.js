const { Embeds: EmbedsMode } = require('discord-paginationembed');
const { MessageEmbed } = require('discord.js');
const { heroesFuzzy, heroes, translate, inheritance } = require('../util/cq-data');
const { getPrefix, imageUrl, parseQuery, parseInheritance, sumStats, statsToString } = require('../util/shared');
const categories = require('../util/categories');

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

    return message.channel.send({
        embed: e
    });
};

const command = (message, args) => {
    const iLvl = parseInheritance(args);
    const name = parseQuery(args, [iLvl]);

    const candidates = heroesFuzzy.search(name);

    if (!candidates.length) {
        return message.channel
            .send('Hero not found!')
            .catch(error => console.log(error));
    }

    const hero = heroes[candidates.map(c => parseInt(c.path.split('.')[0]))[0]];
    const form = hero.forms.filter(f => f.star === 6)[0];

    if (!form) {
        return message.channel
            .send('Hero cannot be inherited!')
            .catch(error => console.log(error));
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

    const disabledKeys = embeds.length > 1 ? [ 'JUMP' ] : [ 'JUMP', 'BACK', 'FORWARD' ];

    return new EmbedsMode()
        .setArray(embeds)
        .setAuthorizedUsers([message.author.id])
        .setChannel(message.channel)
        .showPageIndicator(false)
        .setDisabledNavigationEmojis(disabledKeys)
        .setColor(classColors[hero.class])
        .build();
};

exports.run = (message, args) => {
    if (!args.length) { return instructions(message); }

    return command(message, args);
};

exports.category = categories.DB;
