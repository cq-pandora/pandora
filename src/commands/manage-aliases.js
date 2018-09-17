const { MessageEmbed } = require('discord.js');
const _ = require('lodash');
const aliases = require('../db/aliases');
const {
    functions: { getPrefix },
    categories,
    cmdResult,
    PaginationEmbed,
} = require('../util');

const instructions = (message) => {
    const prefix = getPrefix(message);
    const e = {
        title: `${prefix}alias <action> [<alias>] [<for>]`,
        fields: [{
            name: '<action>',
            value: `Action to perform.\nCan be accept, decline, clear, list or list-all`
        }, {
            name: '<alias>',
            value: `Alias to work with. **Important**: alias should not contain space`
        }, {
            name: '<for>',
            value: `Target for alias.\n**Important**: this should be single word, so test if bot can find what you want to alias by that word`
        }
        ],
        footer: { text: 'Argument order matters!' }
    };

    return message.channel.send({ embed: e })
        .then(m => ({
            status_code: cmdResult.NOT_ENOUGH_ARGS,
        }));
};

const aliasesToEmbeds = ts => {
    let embeds = [];

    const chunks = _.chunk(_.groupBy(ts, 'for'), 10);

    for (let i = 0; i < chunks.length; i++) {
        let embed = new MessageEmbed().setFooter(`Page ${i}/${chunks.length}`);
        for (const aliasGroup of chunks[i]) {
            embed.addField(aliasGroup[0], _.truncate(aliasGroup[1].map(a => a.for).join(', '), 1024));
        }
        embeds.push(embed);
    }

    return embeds;
};

const command = (message, args) => {
    const action = args[0].toLowerCase();

    if (action === 'list-all') {
        return aliases.list()
            .catch(e => { message.channel.send('Unable to list aliases. Please, contact bot owner.'); throw e; })
            .then(aliasesToEmbeds)
            .then(r => r.length ? new PaginationEmbed(message)
                .setArray(r)
                .setAuthorizedUsers([message.author.id])
                .setChannel(message.channel)
                .showPageIndicator(false)
                .build() : message.channel.send('No pending aliases!')
            )
            .then(m => ({
                status_code: cmdResult.SUCCESS,
                target: '*',
                arguments: JSON.stringify({ action: action }),
            }));
    }

    const alias = args[1];

    switch (action) {
    case 'accept':
        return aliases.accept(alias)
            .catch(e => { message.channel.send('Unable to accept alias. Please, contact bot owner.'); throw e; })
            .then(r => message.channel.send('Alias accepted!'))
            .then(m => ({
                status_code: cmdResult.SUCCESS,
                target: alias,
                arguments: JSON.stringify({ action: action, alias: alias }),
            }));
    case 'decline':
        return aliases.decline(alias)
            .catch(e => { message.channel.send('Unable to alias translation. Please, contact bot owner.'); throw e; })
            .then(r => message.channel.send('Alias declined!'))
            .then(m => ({
                status_code: cmdResult.SUCCESS,
                target: alias,
                arguments: JSON.stringify({ action: action, alias: alias }),
            }));
    }

    const fogh = args[2];

    switch (action) {
    case 'clear':
        return aliases.declineAllUnaccepted(fogh)
            .catch(e => { message.channel.send('Unable to clear aliases. Please, contact bot owner.'); throw e; })
            .then(r => message.channel.send('Aliases cleared!'))
            .then(m => ({
                status_code: cmdResult.SUCCESS,
                target: alias,
                arguments: JSON.stringify({ action: action, alias: alias, for: fogh }),
            }));
    case 'list':
        return aliases.list(fogh)
            .catch(e => { message.channel.send('Unable to list submitted aliases. Please, contact bot owner.'); throw e; })
            .then(aliasesToEmbeds)
            .then(r => new PaginationEmbed(message)
                .setArray(r)
                .setAuthorizedUsers([message.author.id])
                .setChannel(message.channel)
                .showPageIndicator(false)
                .build()
            )
            .then(m => ({
                status_code: cmdResult.SUCCESS,
                target: alias,
                arguments: JSON.stringify({ action: action, alias: alias, for: fogh }),
            }));
    default: return message.channel
        .send('Unknown action!')
        .then(m => ({
            status_code: cmdResult.ENTITY_NOT_FOUND,
            target: 'action',
            arguments: JSON.stringify({ action: action, alias: alias, for: fogh }),
        }));
    }
};

exports.run = (message, args) => {
    if (args.length < 1) { return instructions(message); }

    return command(message, args);
};

exports.protected = true;

exports.category = categories.PROTECTED;
