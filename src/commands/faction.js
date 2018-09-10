const { MessageEmbed } = require('discord.js');
const _ = require('lodash');
const {
    fileDb: { factionsFuzzy, factions, heroes, translate },
    functions: { getPrefix, imageUrl, splitText },
    categories,
    cmdResult,
} = require('../util');

const instructions = (message) => {
    const prefix = getPrefix(message);
    const msg = {
        title: `${prefix}faction [<name>]`,
        fields: [
            {
                name: '<name>',
                value: `Get faction data.\n*e.g. ${prefix}faction han*`
            }
        ]
    };

    return message.channel
        .send({ embed: msg })
        .then(m => ({
            status_code: cmdResult.NOT_ENOUGH_ARGS,
        }));
};

const command = (message, args) => {
    const name = args.join(' ');

    const candidates = factionsFuzzy.search(name);

    if (!candidates.length) {
        return message.channel
            .send('Faction not found!')

            .then(m => ({
                status_code: cmdResult.ENTITY_NOT_FOUND,
            }));
    }

    const faction = factions[candidates[0].path];

    const description = heroes
        .filter(h => h.domain === faction.ingame_id)
        .map(h => translate(h.forms[0].name));

    const msg = _.reduce(
        splitText(description),
        (msg, chunk) => msg.addField('\u200b', chunk),
        new MessageEmbed()
            .setTitle(translate(faction.name))
            .setThumbnail(imageUrl('common/' + faction.image))
    );

    return message.channel
        .send(msg)
        .then(m => ({
            status_code: cmdResult.SUCCESS,
            target: faction.id,
            arguments: JSON.stringify({ name: name }),
        }));
};

exports.run = (message, args) => {
    if (!args.length) { return instructions(message); }

    return command(message, args);
};

exports.category = categories.DB;
