const { prefix, aliases, commands, owner_id } = require('../config');

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

    if (!(commands[command] || commands[aliases[command]])){
    	//message.channel.send('Command not found!');
    	return;
    }

    // check if command file exists
    try {
        const executable = (commands[command] || commands[aliases[command]]);
        if (executable.protected && message.author.id !== owner_id) {
            message.channel.send('No enough permissions!');
            return;
        }
        executable.run(message, args);
    } catch (error) {
    	message.channel.send('Error while executing command!');
        console.log(error);
    }
};