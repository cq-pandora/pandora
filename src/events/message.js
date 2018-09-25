const stats = require('../db/stats');
const { cmdResult, categories } = require('../util');
const { prefix, aliases, commands, owner_id: ownerId, permissions } = require('../config');

function getPermittedCommands (message) {
    const serverPermissions = permissions[message.guild.id];

    if (!serverPermissions) {
        return Object.keys(commands);
    }

    const { users = {}, channels = {}, roles = {} } = serverPermissions;

    const userList = users[message.member.id];
    const channelList = channels[message.channel.id];
    const rolesLists = message.member.roles.map(r => roles[r.id]);

    const sortedLists = [userList, channelList, ...rolesLists].filter(Boolean).sort(list => list.priority);

    return sortedLists.reduce(
        (res, list) => list.mode
            ? list.commands
            : res.filter(cmd => !list.commands.includes(cmd)),
        sortedLists[0].mode
            ? sortedLists[0].commands
            : Object.keys(commands),
    );
}

module.exports = (client) => {
    const mentionRe = new RegExp(`^<@!?${client.user.id}>`);

    return async (message) => {
        // ignore bot messages
        if (message.author.bot) {
            return;
        }

        const noPrefix = !prefix || !message.content.startsWith(prefix);
        const noMention = !mentionRe.test(message.content);

        // ignore if not a command
        if (noPrefix && noMention) {
            return;
        }

        // parse message into command and arguments
        let args;
        let command;
        if (noMention) {
            args = message.content.split(' ').filter(Boolean);
            command = args
                .shift()
                .slice(prefix.length)
                .toLowerCase();
        } else {
            args = message.content
                .replace(mentionRe, '')
                .trim()
                .split(' ')
                .filter(Boolean);

            if (!args.length) return;

            command = args.shift().toLowerCase();
        }

        const executable = commands[command] || commands[aliases[command]];

        if (!executable) {
            // message.channel.send('Command not found!');
            return;
        }

        if (!(
            message.guild === null ||
            message.member.hasPermission('ADMINISTRATOR', { checkAdmin: true, checkOwner: true }) ||
            getPermittedCommands(message).includes(executable.name)
        )) {
            await message.channel.send('This command is forbidden here!');
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
        const stat = {
            status_code: cmdResult.SUCCESS
        };

        try {
            if ((executable.protected || executable.category === categories.PROTECTED) && message.author.id !== ownerId) {
                await message.channel.send('No enough permissions!');

                stat.status_code = cmdResult.NOT_ENOUGH_PERMISSIONS;
            } else {
                const response = await executable.run(message, args);

                Object.assign(stat, response);
            }
        } catch (error) {
            await message.channel.send('Error while executing command!');

            stat.status_code = cmdResult.FATAL;

            console.log(error);
        }

        try {
            await stats.submit({
                ...meta,
                ...stat
            });
        } catch (error) {
            console.log('Unable to submit stats: ', error);
        }
    };
};
