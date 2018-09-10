const { functions: { getPrefix }, categories, cmdResult } = require('../util');
const aliases = require('../db/aliases');

const instructions = (message) => {
    const prefix = getPrefix(message);
    const e = {
        title: `${prefix}alias <alias> <for>`,
        fields: [{
            name: '<alias>',
            value: `Suggested alias. **Important**: alias should not contain space`
        }, {
            name: '<for>',
            value: `Alias target.\n**Important**: this should be single word, so test if bot can find what you want to alias by that word`
        }
        ],
        footer: { text: 'Argument order matters!' }
    };

    return message.channel.send({ embed: e })
        .then(m => ({
            status_code: cmdResult.NOT_ENOUGH_ARGS,
        }));
};

const command = (message, args) => aliases.submit(args[0], args[1])
    .catch(e => { message.channel.send('Unable to submit your alias. Please, contact bot owner.'); throw e; })
    .then(r => message.channel.send('Alias request submitted'))
    .then(m => ({
        target_entity: args[1],
        status_code: cmdResult.SUCCESS,
        arguments: JSON.stringify({ alias: args[0], for: args[1] }),
    }));
;

exports.run = (message, args) => {
    if (args.length < 2) { return instructions(message); }

    return command(message, args);
};

exports.category = categories.UTIL;
