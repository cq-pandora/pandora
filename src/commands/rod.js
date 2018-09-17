const { MessageEmbed } = require('discord.js');
const { emojis } = require('../config');
const {
    fileDb: { fishingGearFuzzy, followPath, translate },
    functions: { getPrefix, capitalizeFirstLetter, imageUrl, parseGrade, parseQuery },
    categories,
    cmdResult,
    PaginationEmbed,
} = require('../util');

const instructions = (message) => {
    const prefix = getPrefix(message);
    const e = {
        title: `${prefix}rod <name>`,
        fields: [
            {
                name: '<name>',
                value: `Get rod data`
            }
        ]
    };

    return message.channel.send({ embed: e })
        .then(m => ({
            status_code: cmdResult.NOT_ENOUGH_ARGS,
        }));
};

const command = (message, args) => {
    const name = parseQuery(args);

    const candidates = fishingGearFuzzy.search(name);

    if (!candidates.length) {
        return message.channel
            .send('Rod not found!')
            .then(m => ({
                status_code: cmdResult.ENTITY_NOT_FOUND,
                target: 'rod',
            }));
    }

    const currencies = {
        ITEM_FISHCOIN: emojis.fishcoin,
        ITEM_GOLD: emojis.gold,
        ITEM_HONOR: emojis.honor,
        ITEM_JEWEL: emojis.gem,
    };

    const rods = candidates
        .map(c => followPath(c.path))
        .filter(b => b.type === 'rod');

    const embeds = rods.map((rod, idx, arr) => new MessageEmbed()
        .setTitle(`${translate(rod.name)} (${rod.grade}★)`)
        .setDescription(translate(rod.description))
        .addField(`${capitalizeFirstLetter(rod.habitat)} bonus`, rod.habitat_bonus, true)
        .addField('Bite chance', rod.bite_chance, true)
        .addField('Big fish chance', rod.big_chance, true)
        .addField('Price', `${rod.price}${currencies[rod.currency]}`, true)
        .setFooter(`Page ${idx + 1}/${arr.length}`)
        .setThumbnail(imageUrl('fish/' + rod.image))
    );

    if (!rods.length) {
        return message.channel
            .send('Rod not found!')
            .then(m => ({
                status_code: cmdResult.ENTITY_NOT_FOUND,
                target: 'rod',
            }));
    }

    return new PaginationEmbed(message)
        .setArray(embeds)
        .setAuthorizedUsers([message.author.id])
        .setChannel(message.channel)
        .showPageIndicator(false)
        .build()
        .then(m => ({
            status_code: cmdResult.SUCCESS,
            target: rods.map(f => f.id).join(','),
            arguments: JSON.stringify({ name: name }),
        }));
};

exports.run = (message, args) => {
    if (!args.length) { return instructions(message); }

    return command(message, args);
};

exports.category = categories.DB;
