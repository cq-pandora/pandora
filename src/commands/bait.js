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
        title: `${prefix}bait <name>`,
        fields: [
            {
                name: '<name>',
                value: `Get bait data`
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
            .send('Bait not found!')
            .then(m => ({
                status_code: cmdResult.ENTITY_NOT_FOUND,
                target: 'bait',
            }));
    }

    const baits = candidates
        .map(c => followPath(c.path))
        .filter(b => b.type === 'bait');

    const embeds = baits.map((bait, idx, arr) => new MessageEmbed()
        .setTitle(`${translate(bait.name)} (${bait.grade}★)`)
        .setDescription(translate(bait.description))
        .addField(`${capitalizeFirstLetter(bait.habitat)} bonus`, bait.habitat_bonus, true)
        .addField('Bite chance', bait.bite_chance, true)
        .addField('Big fish chance', bait.big_chance, true)
        .addField('Price', `${bait.price}${emojis.gold}`, true)
        .setFooter(`Page ${idx + 1}/${arr.length}`)
        .setThumbnail(imageUrl('fish/' + bait.image))
    );

    if (!embeds.length) {
        return message.channel
            .send('Bait not found!')
            .then(m => ({
                status_code: cmdResult.ENTITY_NOT_FOUND,
                target: 'bait',
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
            target: baits.map(f => f.id).join(','),
            arguments: JSON.stringify({ name: name }),
        }));
};

exports.run = (message, args) => {
    if (!args.length) { return instructions(message); }

    return command(message, args);
};

exports.category = categories.DB;
