const { Embeds: EmbedsMode } = require('discord-paginationembed');
const { MessageEmbed } = require('discord.js');
const { heroesFuzzy, heroes, translate } = require('../util/cq-data');
const { getPrefix, textSplitter, capitalizeFirstLetter, imageUrl, parseQuery, statsToString } = require('../util/shared');
const _ = require('lodash');

const instructions = (message) => {
    const prefix = getPrefix(message);
    const e = {
        title: `${prefix}skin [<name>]`,
        fields: [{
                name: '<name>',
                value: `Get skin data.\n*e.g. ${prefix}skin lee*`,
            },
        ],
    };

    message.channel.send({ embed: e, });
};

const command = (message, args) => {
    const name = parseQuery(args, []);

    const candidates = heroesFuzzy.search(name);

    if (!candidates.length) {
        return message.channel
            .send('Hero not found!')
            .catch(error => console.log(error));
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

    return new EmbedsMode()
        .setArray(embeds)
        .setAuthorizedUsers([message.author.id])
        .setChannel(message.channel)
        .showPageIndicator(false)
        .setDisabledNavigationEmojis(['JUMP'])
        .build();
};

exports.run = (message, args) => {
    if (!args.length)
        return instructions(message);

    return command(message, args);
};