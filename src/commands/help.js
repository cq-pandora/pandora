const config = require('../config');
const categories = require('../util/categories');
const _ = require('lodash');

exports.category = categories.BOT;
exports.run = (message, args) =>
    message.channel.send({
            embed: {
                title: 'Commands',
                description: `Prefix: ${config.prefix}, ${message.client.user}`,
                fields: _(config.commands).groupBy('category').entries().map(([cat, cmds]) => ({
                    name: cat,
                    value: cmds.map(cmd => `${cmd.name}${config.reverseAliases[cmd.name] ? ` (${config.reverseAliases[cmd.name].join(', ')})` : ''}`).join(', '),
                    inline: false,
                })),
            /*footer: {
                text: `Android ${config.android_version} | iOS ${config.ios_version}`,
            },
            */
        },
    });