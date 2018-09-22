const _ = require('lodash');
const { MessageEmbed } = require('discord.js');

const aliases = require('../db/aliases');
const { getPrefix } = require('../functions');
const {
    categories,
    cmdResult,
    PaginationEmbed,
} = require('../util');

const instructions = async (message) => {
    const prefix = getPrefix(message);
    const embed = {
        title: `${prefix}alias <action> [<alias>] [<for>]`,
        fields: [
            {
                name: '<action>',
                value: `Action to perform.\nCan be accept, decline, clear, list or list-all`
            },
            {
                name: '<alias>',
                value: `Alias to work with. **Important**: alias should not contain space`
            },
            {
                name: '<for>',
                value: `Target for alias.\n**Important**: this should be single word, so test if bot can find what you want to alias by that word`
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

const actions = {
    list: async (message, { fogh }) => {
        try {
            const list = aliasesToEmbeds(await aliases.list(fogh));

            if (!list.length) {
                await message.channel.send('No pending aliases!');
            }

            const embed = new PaginationEmbed(message)
                .setArray(list)
                .setAuthorizedUsers([message.author.id])
                .setChannel(message.channel)
                .showPageIndicator(false)
                .build();

            await embed;
        } catch (error) {
            message.channel.send('Unable to list aliases. Please, contact bot owner.');

            throw error;
        }
    },
    accept: async (message, { alias }) => {
        try {
            await aliases.accept(alias);

            await message.channel.send('Alias accepted!');
        } catch (error) {
            await message.channel.send('Unable to accept alias. Please, contact bot owner.');

            throw error;
        }
    },
    decline: async (message, { alias }) => {
        try {
            await aliases.decline(alias);

            await message.channel.send('Alias declined!');
        } catch (error) {
            await message.channel.send('Unable to alias translation. Please, contact bot owner.');

            throw error;
        }
    },
    clear: async (message, { fogh }) => {
        try {
            await aliases.declineAllUnaccepted(fogh);

            await message.channel.send('Aliases cleared!');
        } catch (error) {
            await message.channel.send('Unable to clear aliases. Please, contact bot owner.');

            throw error;
        }
    }
};

actions['list-all'] = actions.list;

const command = async (message, [nameAction, alias, fogh]) => {
    nameAction = nameAction.toLowerCase();

    const action = actions[nameAction];

    if (!action) {
        await message.channel.send('Unknown action!');

        return {
            status_code: cmdResult.ENTITY_NOT_FOUND,
            target: 'action',
            arguments: JSON.stringify({ action: nameAction, alias, for: fogh }),
        };
    }

    const response = await action(message, {
        action: nameAction,
        alias,
        fogh
    });

    if (!response) {
        return {
            status_code: cmdResult.SUCCESS,
            target: alias || '*',
            arguments: JSON.stringify({
                action: nameAction,
                for: fogh,
                alias
            }),
        };
    }

    return response;
};

exports.run = (message, args) => (
    args.length < 1
        ? instructions(message)
        : command(message, args)
);

exports.protected = true;

exports.category = categories.PROTECTED;
