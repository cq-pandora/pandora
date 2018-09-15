const { prefix, aliases, commands, owner_id } = require('../config');
const { cmdResult, categories } = require('../util');
const stats = require('../db/stats');
const _ = require('lodash');

module.exports = message => {
    // ignore bot messages
    if (message.author.bot) {
        return;
    }

    const mentionRegExp = RegExp(`^<@!?${message.client.user.id}>`);
    const noPrefix = !prefix || !message.content.startsWith(prefix);
    const noMention = !mentionRegExp.test(message.content);

    // ignore if not a command
    if (noPrefix && noMention) {
        return;
    }

    // parse message into command and arguments
    let args;
    let command;
    if (noMention) {
        args = message.content.split(' ').filter(t => !!t);
        command = args
            .shift()
            .slice(prefix.length)
            .toLowerCase();
    } else {
        args = message.content
            .replace(mentionRegExp, '')
            .trim()
            .split(' ')
            .filter(t => !!t);
        command = args.shift().toLowerCase();
    }

    const executable = commands[command] || commands[aliases[command]];

    if (!executable) {
        // message.channel.send('Command not found!');
        return;
    }

    const meta = {
        command: executable.name,
        user_id: message.author.id,
        channel_id: message.channel.id,
        server: (message.channel.guild || message.author).id,
        sent_to: message.channel.type,
        content: message.content,
    };

    let msg = null;

    try {
        // eslint-disable-next-line camelcase
        if ((executable.protected || executable.category === categories.PROTECTED) && message.author.id !== owner_id) {
            msg = message.channel.send('No enough permissions!')
                .then(() => ({
                    status_code: cmdResult.NOT_ENOUGH_PERMISSIONS,
                }));
        } else {
            msg = executable.run(message, args)
                .catch(e => console.log(e));
        }
    } catch (error) {
        msg = message.channel.send('Error while executing command!')
            .then(m => ({
                status_code: cmdResult.FATAL,
            }));
        console.log(error);
    }

    msg.then(stat => stats.submit(_.defaults(stat, meta))).catch(e => console.log('Unable to submit stats: ', e));
};
