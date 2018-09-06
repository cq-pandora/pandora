const { MessageEmbed } = require('discord.js');
const { heroesFuzzy, heroes, translate } = require('../util/cq-data');
const { getPrefix } = require('../util/shared');
const _ = require('lodash');
const translations = require('../db/translations');
const categories = require('../util/categories');

const instructions = (message) => {
    const prefix = getPrefix(message);
    const e = {
        title: `${prefix}translate <field> <name> <grade> <translation>`,
        fields: [{
                name: '<field>',
                value: `Field to translate.\nCan be block-name, block-description, passive-name, passive-description, lore, name, sbw-name or sbw-ability`,
            },{
                name: '<name>',
                value: `Hero name.\n**Important**: this should be single word, so test if bot can find what you want to translate by that word`,
            },{
                name: '<grade>',
                value: `SBW or hero grade`,
            },{
                name: '<translation>',
                value: `Full translation text as last parameter`,
            }
        ],
        footer: { text: 'Argument order matters!', },
    };

    message.channel.send({ embed: e, });
};

const command = (message, args) => {
    const field = args[0];
    const name = args[1];
    const grade = parseInt(args[2]);

    const candidates = heroesFuzzy.search(name);

    if (!candidates.length) {
        return message.channel
            .send('Hero not found!')
            .catch(error => console.log(error));
    }

    const hero = heroes[candidates.map(c => parseInt(c.path.split('.')[0]))[0]];
    
    let form = null, sbw = null;

    if (field.includes('sbw')) {
        sbw = hero.sbws.filter(f => f.star == grade)[0];

        if (!sbw)
            return message.channel
                .send('Soulbound weapon grade not found!')
                .catch(error => console.log(error));
    } else {
        form = hero.forms.filter(f => f.star == grade)[0];

        if (!form) 
            return message.channel
                .send('Hero grade not found!')
                .catch(error => console.log(error));
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
            .catch(error => console.log(error));
    }

    const text = args.splice(3).filter(t => t && t.trim()).join(' ');

    return translations.submit(key, text)
        .catch(error => message.channel.send('Unable to submit your transltion. Please, contact bot owner.'))
        .then(r => message.channel.send('Translation request submited!\nThanks for trying to make translations clearer'))
        .catch(error => console.log(error));
};

exports.run = (message, args) => {
    if (args.length < 4)
        return instructions(message);

    return command(message, args);
};

exports.category = categories.UTIL;