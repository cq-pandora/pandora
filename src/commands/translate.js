const translations = require('../db/translations');
const {
    fileDb: { heroesFuzzy, followPath },
    functions: { getPrefix },
    categories,
    cmdResult,
} = require('../util');

const instructions = (message) => {
    const prefix = getPrefix(message);
    const e = {
        title: `${prefix}translate <field> <name> <grade> <translation>`,
        fields: [{
            name: '<field>',
            value: `Field to translate.\nCan be block-name, block-description, passive-name, passive-description, lore, name, sbw-name or sbw-ability`
        }, {
            name: '<name>',
            value: `Hero name.\n**Important**: this should be single word, so test if bot can find what you want to translate by that word`
        }, {
            name: '<grade>',
            value: `SBW or hero grade`
        }, {
            name: '<translation>',
            value: `Full translation text as last parameter`
        }
        ],
        footer: { text: 'Argument order matters!' }
    };

    return message.channel.send({ embed: e })
        .then(m => ({
            status_code: cmdResult.NOT_ENOUGH_ARGS,
        }));
};

const command = (message, args) => {
    const field = args[0];
    const name = args[1];
    const grade = parseInt(args[2]);

    const candidates = heroesFuzzy.search(name);

    if (!candidates.length) {
        return message.channel
            .send('Hero not found!')
            .then(m => ({
                status_code: cmdResult.ENTITY_NOT_FOUND,
                target: 'hero',
            }));
    }

    const hero = followPath(candidates[0].path);

    let form = null; let sbw = null;

    if (field.includes('sbw')) {
        sbw = hero.sbws.filter(f => f.star === grade)[0];

        if (!sbw) {
            return message.channel
                .send('Soulbound weapon grade not found!')
                .then(m => ({
                    status_code: cmdResult.ENTITY_GRADE_NOT_FOUND,
                    target: sbw.id,
                }));
        }
    } else {
        form = hero.forms.filter(f => f.star === grade)[0];

        if (!form) {
            return message.channel
                .send('Hero grade not found!')
                .then(m => ({
                    status_code: cmdResult.ENTITY_GRADE_NOT_FOUND,
                    target: hero.id,
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

    const text = args.splice(3).filter(t => t && t.trim()).join(' ');

    return translations.submit(key, text)
        .catch(e => { message.channel.send('Unable to submit your transltion. Please, contact bot owner.'); throw e; })
        .then(r => message.channel.send('Translation request submited!\nThanks for trying to make translations clearer'))
        .then(m => ({
            status_code: cmdResult.SUCCESS,
            target: hero ? hero.id : sbw.id,
            arguments: JSON.stringify({ field: field, name: name, grade: grade, text: text }),
        }));
};

exports.run = (message, args) => {
    if (args.length < 4) { return instructions(message); }

    return command(message, args);
};

exports.category = categories.UTIL;
