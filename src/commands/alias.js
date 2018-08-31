const { MessageEmbed } = require('discord.js');
const { heroesFuzzy, heroes, translate } = require('../util/cq-data');
const { getPrefix } = require('../util/shared');
const _ = require('lodash');
const aliases = require('../db/aliases');

const instructions = (message) => {
    const prefix = getPrefix(message);
    const e = {
        title: `${prefix}alias <alias> <for>`,
        fields: [{
                name: '<alias>',
                value: `Suggested alias. **Important**: alias should not contain space`,
            },{
                name: '<for>',
                value: `Alias target.\n**Important**: this should be single word, so test if bot can find what you want to alias by that word`,
            },
        ],
        footer: { text: 'Argument order matters!', },
    };

    message.channel.send({ embed: e, });
};

const command = (message, args) => aliases.submit(args[0], args[1])
        .catch(error => message.channel.send('Unable to submit your alias. Please, contact bot owner.'))
        .then(r => message.channel.send('Alias request submitted'))
        .catch(error => console.log(error));
;

exports.run = (message, args) => {
    if (args.length < 2)
        return instructions(message);

    return command(message, args);
};