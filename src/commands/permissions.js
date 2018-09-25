const _ = require('lodash');
const { MessageEmbed } = require('discord.js');

const { permissions } = require('../config');
const { set:setPermissions, clear:clearPermissions } = require('../db/permissions');
const { getPrefix, extractMentions, parseQuery } = require('../functions');
const {
    categories,
    cmdResult,
    PaginationEmbed,
} = require('../util');

const instructions = async (message) => {
    const prefix = getPrefix(message);
    const embed = {
        title: `${prefix}permissions <mode> [<targets>] [<commands>]`,
        fields: [
            {
                name: '<mode>',
                value: `Filter mode. Can be whitelist, blacklist or remove`
            },
            {
                name: '<targets>',
                value: `Mentions of users, channels or roles to apply action to. If not specified, current channel is used instead`
            },
            {
                name: '<comamnds>',
                value: `Anything that is not mention and not fist argument is treated as command.
                If not specified, list will be cleared`
            }
        ],
        footer: { text: 'Argument order matters!' }
    };

    await message.channel.send({ embed });

    return {
        status_code: cmdResult.NOT_ENOUGH_ARGS,
    };
};

const aliasesToEmbeds = ts => {
    const embeds = [];

    const chunks = _.chunk(_.groupBy(ts, 'for'), 10);

    let i = 0;
    for (const chunk of chunks) {
        const embed = new MessageEmbed()
            .setFooter(`Page ${i}/${chunks.length}`);

        for (const [key, value] of chunk) {
            embed.addField(key, _.truncate(value.map(a => a.for).join(', '), 1024));
        }

        embeds.push(embed);

        i += 1;
    }

    return embeds;
};

const modes = {
    whitelist: 1,
    blacklist: 0,
    remove: -1,
};

const command = async (message, args) => {
    if (message.guild === null) {
        await message.channel.send('This command designed only for servers!');

        return {
            status_code: cmdResult.WRONG_CHANNEL_TYPE,
        }
    }

    const modeName = args.shift().toLowerCase();

    const mode = modes[modeName];

    if (mode !== 0 && !mode) {
        await message.channel.send('Unknown mode!');

        return {
            status_code: cmdResult.ENTITY_NOT_FOUND,
            target: 'mode',
            arguments: JSON.stringify({ mode: modeName}),
        };
    }

    let targets = extractMentions(args.join(' '));
    const parsedCommands = parseQuery(args, targets.map(t => t.text)).split(' ').filter(s => s.trim());

    if (!targets.length) {
        targets = [{ type: 'channel', id: message.channel.id }];
    }

    const mergedTargets = targets
        .map(t => permissions.merge([message.guild.id, t.type, t.id, mode, parsedCommands]));

    const shouldBeCleared = mergedTargets.filter(t => !t.commands.length);
    const shouldBeSet = mergedTargets.filter(t => Boolean(t.commands.length));

    if (shouldBeSet.length) {
        await setPermissions(message.guild.id, shouldBeSet);
    }

    if (shouldBeCleared.length){
        await clearPermissions(shouldBeCleared);
    }

    message.channel.send('Permissions updated!');

    return {
        status_code: cmdResult.SUCCESS,
        target: targets.map(t => `${t.id}@${t.type}`).join(','),
        arguments: JSON.stringify({
            mode: modeName,
            targets: targets.map(t => `${t.id}@${t.type}`).join(','),
            commands: parsedCommands.join(',')
        }),
    };
};

exports.run = (message, args) => (
    args.length < 2
        ? instructions(message)
        : command(message, args)
);

exports.protected = true;

exports.category = categories.PROTECTED;
