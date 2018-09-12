const { MessageEmbed } = require('discord.js');
const {
    fileDb: { heroesFuzzy, heroes, translate },
    functions: { getPrefix, imageUrl, parseQuery, statsToString },
    categories,
    cmdResult,
    PaginationEmbed,
} = require('../util');

const instructions = (message) => {
    const prefix = getPrefix(message);
    const e = {
        title: `${prefix}skin [<name>]`,
        fields: [{
            name: '<name>',
            value: `Get skin data.\n*e.g. ${prefix}skin lee*`
        }
        ]
    };

    return message.channel.send({ embed: e })
        .then(m => ({
            status_code: cmdResult.NOT_ENOUGH_ARGS,
        }));
};

const command = (message, args) => {
    const name = parseQuery(args, []);

    const candidates = heroesFuzzy.search(name);

    if (!candidates.length) {
        return message.channel
            .send('Hero not found!')
            .then(m => ({
                status_code: cmdResult.ENTITY_NOT_FOUND,
                target: 'hero',
            }));
    }

    const hero = heroes[candidates.map(c => parseInt(c.path.split('.')[0]))[0]];

    const embeds = hero.skins.map((skin, idx, arr) =>
        new MessageEmbed()
            .setTitle(translate(skin.name))
            .setDescription(statsToString(skin.stats))
            .setThumbnail(imageUrl('heroes/' + skin.image))
            .setFooter(`Page ${idx + 1}/${arr.length}`)
            .addField('Sell price', skin.cost, true)
    );

    return new PaginationEmbed(message)
        .setArray(embeds)
        .setAuthorizedUsers([message.author.id])
        .setChannel(message.channel)
        .showPageIndicator(false)
        .build()
        .then(m => ({
            status_code: cmdResult.SUCCESS,
            target: hero.id,
            arguments: JSON.stringify({ name: name }),
        }));
};

exports.run = (message, args) => {
    if (!args.length) { return instructions(message); }

    return command(message, args);
};

exports.category = categories.DB;
