const { functions: { getPrefix }, categories, cmdResult } = require('../util');
const aliases = require('../db/aliases');

const instructions = (message) => {
    const prefix = getPrefix(message);
    const e = {
        title: `${prefix}alias <alias> <for>`,
        fields: [{
            name: '<alias>',
            value: `Suggested alias. **Important**: alias can be single word only`
        }, {
            name: '<for>',
            value: `Alias target`
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
    const alias = args.shift();
    const fogh = args.join(' ');
    return aliases.submit(alias, fogh)
        .catch(e => { message.channel.send('Unable to submit your alias. Please, contact bot owner.'); throw e; })
        .then(r => message.channel.send('Alias request submitted'))
        .then(m => ({
            target: fogh,
            status_code: cmdResult.SUCCESS,
            arguments: JSON.stringify({ alias: alias, for: fogh }),
        }));
}

exports.run = (message, args) => {
    if (args.length < 2) { return instructions(message); }

    return command(message, args);
};

exports.category = categories.UTIL;
