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
        title: `${prefix}float <name>`,
        fields: [
            {
                name: '<name>',
                value: `Get float data`
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
            .send('Float not found!')
            .then(m => ({
                status_code: cmdResult.ENTITY_NOT_FOUND,
                target: 'float',
            }));
    }

    const currencies = {
        ITEM_FISHCOIN: emojis.fishcoin,
        ITEM_GOLD: emojis.gold,
        ITEM_HONOR: emojis.honor,
        ITEM_JEWEL: emojis.gem,
    };

    const floats = candidates
        .map(c => followPath(c.path))
        .filter(b => b.type === 'float');

    const embeds = floats.map((float, idx, arr) => new MessageEmbed()
            .setTitle(`${translate(float.name)} (${float.grade}★)`)
            .setDescription(translate(float.description))
            .addField(`${capitalizeFirstLetter(float.habitat)} bonus`, float.habitat_bonus, true)
            .addField('Bite chance', float.bite_chance, true)
            .addField('Big fish chance', float.big_chance, true)
            .addField('Price', `${float.price}${currencies[float.currency]}`, true)
            .setFooter(`Page ${idx + 1}/${arr.length}`)
            .setThumbnail(imageUrl('fish/' + float.image))
        );

    if (!floats.length) {
        return message.channel
            .send('Float not found!')
            .then(m => ({
                status_code: cmdResult.ENTITY_NOT_FOUND,
                target: 'float',
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
            target: floats.map(f => f.id).join(','),
            arguments: JSON.stringify({ name: name }),
        }));
};

exports.run = (message, args) => {
    if (!args.length) { return instructions(message); }

    return command(message, args);
};

exports.category = categories.DB;
