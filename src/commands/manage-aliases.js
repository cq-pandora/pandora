const { Embeds: EmbedsMode } = require('discord-paginationembed');
const { MessageEmbed } = require('discord.js');
const { heroesFuzzy, heroes, translate, keysDescriptions } = require('../util/cq-data');
const { getPrefix } = require('../util/shared');
const _ = require('lodash');
const aliases = require('../db/aliases');

const instructions = (message) => {
    const prefix = getPrefix(message);
    const e = {
        title: `${prefix}alias <action> [<alias>] [<for>]`,
        fields: [{
                name: '<action>',
                value: `Action to perform.\nCan be accept, decline, clear, list or list-all`,
            },{
                name: '<alias>',
                value: `Alias to work with. **Important**: alias should not contain space`,
            },{
                name: '<for>',
                value: `Target for alias.\n**Important**: this should be single word, so test if bot can find what you want to alias by that word`,
            },
        ],
        footer: { text: 'Argument order matters!', },
    };

    message.channel.send({ embed: e, });
};

const aliasesToEmbeds = ts => {
    let embeds = [];
    
    const chunks = _.chunk(_.groupBy(ts, 'for'), 10);

    for (var i = 0; i < chunks.length; i++) {
        let embed = new MessageEmbed().setFooter(`Page ${i}/${chunks.length}`);
        for (const aliasGroup of chunks[i]) {
            res.addField(aliasGroup[0], _.truncate(aliasGroup[1].map(a => a.for).join(', '), 1024));
        }
        embeds.push(embed);
    }

    return embeds;
}

const command = (message, args) => {
    const action = args[0].toLowerCase();
    
    if (action === 'list-all') {
        return aliases.list()
            .catch(error => message.channel.send('Unable to list aliases. Please, contact bot owner.'))
            .then(aliasesToEmbeds)
            .then(r => r.length ? new EmbedsMode()
                .setArray(r)
                .setAuthorizedUsers([message.author.id])
                .setChannel(message.channel)
                .showPageIndicator(false)
                .setDisabledNavigationEmojis(['JUMP'])
                .build() : message.channel.send('No pending aliases!')
            ).catch(e => console.log(e))
    }

    const alias = args[1];

    switch (action) {
        case 'accept': 
            return aliases.accept(alias)
                .catch(e => message.channel.send('Unable to accept alias. Please, contact bot owner.'))
                .then(r => message.channel.send('Alias accepted!')) 
            break;
        case 'decline':  
            return aliases.decline(alias)
                .catch(e => message.channel.send('Unable to alias translation. Please, contact bot owner.'))
                .then(r => message.channel.send('Alias declined!')) 
            break;
    }

    const fogh = args[2];

    switch (action) {
        case 'clear': 
            aliases.declineAllUnaccepted(fogh)
                .catch(e => message.channel.send('Unable to clear aliases. Please, contact bot owner.'))
                .then(r => message.channel.send('Aliases cleared!')) 
            break;
        case 'list': 
            aliases.list(fogh)
                .catch(error => message.channel.send('Unable to list submitted aliases. Please, contact bot owner.'))
                .then(aliasesToEmbeds)
                .then(r => new EmbedsMode()
                    .setArray(r)
                    .setAuthorizedUsers([message.author.id])
                    .setChannel(message.channel)
                    .showPageIndicator(false)
                    .setDisabledNavigationEmojis(['JUMP'])
                    .build()
                ).catch(e => console.log(e))
            break;
        default: return message.channel
            .send('Unknown action!')
            .catch(error => console.log(error));    
    }
};

exports.run = (message, args) => {
    if (args.length < 1)
        return instructions(message);

    return command(message, args);
};

exports.protected = true;