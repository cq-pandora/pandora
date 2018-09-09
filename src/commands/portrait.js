const { Embeds: EmbedsMode } = require('discord-paginationembed');
const { MessageEmbed } = require('discord.js');
const {
    fileDb: { heroesFuzzy, heroes },
    functions: { getPrefix, imageUrl },
    categories,
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

    message.channel.send({
        embed: e
    });
};

const command = (message, args) => {
    const name = args.join(' ');

    const candidates = heroesFuzzy.search(name);

    if (!candidates.length) {
        return message.channel
            .send('Hero not found!')
            .catch(error => console.log(error));
    }

    const hero = heroes[candidates.map(c => parseInt(c.path.split('.')[0]))[0]];

    if (!hero.portraits.length) {
        return message.channel
            .send('No portraits available for this hero!')
            .catch(error => console.log(error));
    }

    const embeds = hero.portraits.map((portrait, idx, arr) =>
        new MessageEmbed()
            .setImage(imageUrl('portraits/' + portrait))
            .setFooter(`Page ${idx + 1}/${arr.length}`)
    );

    return new EmbedsMode()
        .setArray(embeds)
        .setAuthorizedUsers([message.author.id])
        .setChannel(message.channel)
        .showPageIndicator(false)
        .setDisabledNavigationEmojis(['JUMP'])
        .build();
};

exports.run = (message, args) => {
    if (!args.length) { return instructions(message); }

    return command(message, args);
};

exports.category = categories.DB;
