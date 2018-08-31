const config = require('../config');
const fs = require('fs');
const _ = require('lodash');
const path = require('path');

const commandsDir = '../commands/';

const commands = _.reduce(fs.readdirSync(path.resolve(__dirname, commandsDir)), (res, c) => {
    if (!c.endsWith('.js')) {
        return res;
    }

    res[c.substring(0, c.length - 3).toLowerCase()] = require(path.resolve(__dirname, commandsDir, c));
    return res;
}, {});

module.exports = message => {
    // uncomment for self bot
    // if (message.author.id !== message.client.user.id) {
    //   return;
    // }

    // ignore bot messages
    if (message.author.bot) {
        return;
    }

    // ignore messages not from guild text channels
    // if (message.channel.type !== 'text') {
    //   return;
    // }

    const mentionRegExp = RegExp(`^<@!?${message.client.user.id}>`);
    const noPrefix = !config.prefix || !message.content.startsWith(config.prefix);
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
            .slice(config.prefix.length)
            .toLowerCase();
    } else {
        args = message.content
            .replace(mentionRegExp, '')
            .trim()
            .split(' ')
            .filter(t => !!t);
        command = args.shift().toLowerCase();
    }

    if (!(commands[command] || commands[config.aliases[command]])){
    	//message.channel.send('Command not found!');
    	return;
    }

    // check if command file exists
    try {
        const executable = (commands[command] || commands[config.aliases[command]]);
        if (executable.protected && message.author.id !== config.owner_id) {
            message.channel.send('No enough permissions!');
            return;
        }
        executable.run(message, args);
    } catch (error) {
    	message.channel.send('Error while executing command!');
        console.log(error);
    }
};