const { MessageEmbed } = require('discord.js');
const _ = require('lodash');
const translations = require('../db/translations');
const {
    fileDb: { heroesFuzzy, heroes, keysDescriptions },
    functions: { getPrefix, splitText },
    categories,
    cmdResult,
    PaginationEmbed,
} = require('../util');

const instructions = (message) => {
    const prefix = getPrefix(message);
    const e = {
        title: `${prefix}manage-translations <action> [<field>] [<name>] [<grade>] [<id>]`,
        fields: [{
            name: '<action>',
            value: `Action to perform.\nCan be accept, decline, clear, list or list-all`
        }, {
            name: '<field>',
            value: `Field to translate.\nCan be block-name, block-description, passive-name, passive-description, lore, name, sbw-name or sbw-ability`
        }, {
            name: '<name>',
            value: `Hero name.\n**Important**: this should be single word, so test if bot can find what you want to translate by that word`
        }, {
            name: '<grade>',
            value: `SBW or hero grade`
        }, {
            name: '<id>',
            value: `ID of translations to accept or decline`
        }
        ],
        footer: { text: 'Argument order matters!' }
    };

    return message.channel.send({ embed: e })
        .then(m => ({
            status_code: cmdResult.NOT_ENOUGH_ARGS,
        }));
};

const translationsToEmbeds = ts => {
    let embeds = [];
    const chunks = _.chunk(ts, 10);

    for (var i = 0; i < chunks.length; i++) {
        let embed = new MessageEmbed().setFooter(`Translations ${i * 10 + 1}-${i * 10 + chunks[i].length}/${ts.length}`);
        for (const translation of chunks[i]) {
            _.reduce(splitText(translation.text), (res, chunk, idx) => res.addField(idx ? '\u200b' : `${keysDescriptions[translation.key]}, ID: ${translation.id}`, chunk), embed);
        }
        embeds.push(embed);
    }

    return embeds;
};

const command = (message, args) => {
    const action = args[0].toLowerCase();

    if (action === 'list-all') {
        return translations.list()
            .catch(e => { message.channel.send('Unable to list submitted translations. Please, contact bot owner.'); throw e; })
            .then(translationsToEmbeds)
            .then(r => r.length ? new PaginationEmbed(message)
                .setArray(r)
                .setAuthorizedUsers([message.author.id])
                .setChannel(message.channel)
                .showPageIndicator(false)
                .build() : message.channel.send('No pending translations!')
            )
            .then(m => ({
                status_code: cmdResult.SUCCESS,
                target: '*',
                arguments: JSON.stringify({ action: action }),
            }));
    }

    const field = args[1];

    switch (action) {
    case 'accept':
        return translations.accept(field)
            .catch(e => { message.channel.send('Unable to accept translation. Please, contact bot owner.'); throw e; })
            .then(m => ({
                status_code: cmdResult.SUCCESS,
                target: field,
                arguments: JSON.stringify({ action: action, field: field }),
            }))
            .then(r => message.channel.send('Translation accepted!'));
    case 'decline':
        return translations.decline(field)
            .catch(e => { message.channel.send('Unable to decline translation. Please, contact bot owner.'); throw e; })
            .then(m => ({
                status_code: cmdResult.SUCCESS,
                target: field,
                arguments: JSON.stringify({ action: action, field: field }),
            }))
            .then(r => message.channel.send('Translation declined!'));
    }

    const name = args[2];
    const grade = parseInt(args[3]);

    const candidates = heroesFuzzy.search(name);

    if (!candidates.length) {
        return message.channel
            .send('Hero not found!')
            .then(m => ({
                status_code: cmdResult.ENTITY_NOT_FOUND,
                target: 'hero',
            }));
    }

    const hero = heroes[candidates.map(c => parseInt(c.path.split('.')[0]))[0]];

    let form = null; let sbw = null;

    if (action.includes('sbw')) {
        sbw = hero.sbws.filter(f => f.star === grade)[0];

        if (!sbw) {
            return message.channel
                .send('Soulbound weapon grade not found!')
                .then(m => ({
                    status_code: cmdResult.ENTITY_GRADE_NOT_FOUND,
                    target: 'sbw',
                }));
        }
    } else {
        form = hero.forms.filter(f => f.star === grade)[0];

        if (!form) {
            return message.channel
                .send('Hero grade not found!')
                .then(m => ({
                    status_code: cmdResult.ENTITY_GRADE_NOT_FOUND,
                    target: 'hero',
                }));
        }
    }

    let key = null;

    switch (field) {
    case 'block-name': key = form.block_name; break;
    case 'block-description': key = form.block_description; break;
    case 'passive-name': key = form.passive_name; break;
    case 'passive-description': key = form.passive_description; break;
    case 'lore': key = form.lore; break;
    case 'name': key = form.name; break;
    case 'sbw-name': key = sbw.name; break;
    case 'sbw-ability': key = sbw.ability; break;
    default: return message.channel
        .send('Unknown field!')
        .then(m => ({
            status_code: cmdResult.ENTITY_NOT_FOUND,
            target: 'field',
        }));
    }

    switch (action) {
    case 'clear':
        return translations.declineAllUnaccepted(key)
            .catch(e => { message.channel.send('Unable to clear translations. Please, contact bot owner.'); throw e; })
            .then(r => message.channel.send('Translation accepted!'))
            .then(m => ({
                status_code: cmdResult.SUCCESS,
                target: key,
                arguments: JSON.stringify({ action: action, field: field }),
            }));
    case 'list':
        return translations.list(key)
            .catch(e => { message.channel.send('Unable to list submitted translations. Please, contact bot owner.'); throw e; })
            .then(translationsToEmbeds)
            .then(r => new PaginationEmbed(message)
                .setArray(r)
                .setAuthorizedUsers([message.author.id])
                .setChannel(message.channel)
                .showPageIndicator(false)
                .build()
            )
            .then(m => ({
                status_code: cmdResult.SUCCESS,
                target: key,
                arguments: JSON.stringify({ action: action, field: field, key: key }),
            }));
    default: return message.channel
        .send('Unknown action!')
        .then(m => ({
            status_code: cmdResult.ENTITY_NOT_FOUND,
            target: 'action',
            arguments: JSON.stringify({ action: action, field: field }),
        }));
    }
};

exports.run = (message, args) => {
    if (args.length < 1) { return instructions(message); }

    return command(message, args);
};

exports.protected = true;
exports.category = categories.PROTECTED;
