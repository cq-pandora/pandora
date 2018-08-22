const { MessageEmbed } = require('discord.js');
const { factionsFuzzy, factions, heroes, translate, } = require('../cq-data');
const { getPrefix, imageUrl, textSplitter } = require('../util/shared');
const _ = require('lodash');

const instructions = (message) => {
    const prefix = getPrefix(message);
    const msg = {
        title: `${prefix}faction [<name>]`,
        fields: [{
                name: '<name>',
                value: `Get faction data.\n*e.g. ${prefix}faction han*`,
            },
        ],
    };

    return message.channel
        .send({embed: msg})
        .catch(error => console.log(error))
}

const command = (message, args) => {
    const name = args[0];
    
    const candidates = factionsFuzzy.search(name);

    if (!candidates.length) {
        return message.channel
            .send('Faction not found!')
            .catch(error => console.log(error));
    }

    const faction = factions[candidates[0].path];

    const description = heroes
        .filter(h => h.domain === faction.ingame_id)
        .map(h => translate(h.forms[0].name));

    const msg = _.reduce(
        textSplitter(description), 
        (msg, chunk) => msg.addField('\u200b', chunk),
        new MessageEmbed()
            .setTitle(translate(faction.name))
            .setThumbnail(imageUrl('heroes/' + faction.image))
    );

    return message.channel
        .send(msg)
        .catch(error => console.log(error));
};

exports.run = (message, args) => {
    if (!args.length) 
        return instructions(message);

    return command(message, args);
};