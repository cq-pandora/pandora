const { MessageEmbed } = require('discord.js');
const {
    fileDb: { heroesFuzzy, followPath },
    functions: { getPrefix, imageUrl },
    categories,
    cmdResult,
    PaginationEmbed,
} = require('../util');

const instructions = (message) => {
    const prefix = getPrefix(message);
    const e = {
        title: `${prefix}portrait [<name>]`,
        fields: [
            {
                name: '<name>',
                value: `Get hero portraits.\n*e.g. ${prefix}portrait leon*`
            }
        ]
    };

    return message.channel.send({ embed: e })
        .then(m => ({
            status_code: cmdResult.NOT_ENOUGH_ARGS,
        }));
};

const command = (message, args) => {
    const name = args.join(' ');

    const candidates = heroesFuzzy.search(name);

    if (!candidates.length) {
        return message.channel
            .send('Hero not found!')
            .then(m => ({
                status_code: cmdResult.ENTITY_NOT_FOUND,
            }));
    }

    const hero = followPath(candidates[0].path);

    if (!hero.portraits.length) {
        return message.channel
            .send('No portraits available for this hero!')
            .then(m => ({
                status_code: cmdResult.SUBENTITY_NOT_FOUND,
                target: hero.id,
                arguments: JSON.stringify({ name: name }),
            }));
    }

    const embeds = hero.portraits.map((portrait, idx, arr) =>
        new MessageEmbed()
            .setImage(imageUrl('portraits/' + portrait))
            .setFooter(`Page ${idx + 1}/${arr.length}`)
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
