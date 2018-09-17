const { MessageEmbed } = require('discord.js');
const {
    fileDb: { bossesFuzzy, followPath, translate },
    functions: { getPrefix, statsToString, imageUrl, parseQuery },
    categories,
    cmdResult,
    PaginationEmbed,
} = require('../util');

const instructions = (message) => {
    const prefix = getPrefix(message);
    const e = {
        title: `${prefix}bosses <boss name>`,
        fields: [
            {
                name: '<boss name>',
                value: `Get boss stats`
            }
        ]
    };

    return message.channel.send({ embed: e })
        .then(m => ({
            status_code: cmdResult.NOT_ENOUGH_ARGS,
        }));
};

const command = (message, args) => {
    const name = parseQuery(args);

    const candidates = bossesFuzzy.search(name);

    if (!candidates.length) {
        return message.channel
            .send('Boss not found!')
            .then(m => ({
                status_code: cmdResult.ENTITY_NOT_FOUND,
            }));
    }

    const bosses = candidates.map(c => followPath(c.path));

    if (!bosses.length) {
        return message.channel
            .send('There are no bosses on this stage!')
            .then(m => ({
                status_code: cmdResult.ENTITY_GRADE_NOT_FOUND,
            }));
    }

    const embeds = bosses.map((boss, idx, arr) => new MessageEmbed()
        .setTitle(`${translate(boss.name)}`)
        .setDescription(statsToString(boss))
        .setThumbnail(imageUrl('heroes/' + boss.image))
        .setFooter(`Page ${idx + 1}/${arr.length}`)
    );

    return new PaginationEmbed(message)
        .setArray(embeds)
        .setAuthorizedUsers([message.author.id])
        .setChannel(message.channel)
        .showPageIndicator(false)
        .build()
        .then(m => ({
            status_code: cmdResult.SUCCESS,
            target: bosses.map(b => b.id).join(','),
            arguments: JSON.stringify({ name: name }),
        }));
};

exports.run = (message, args) => {
    if (!args.length) { return instructions(message); }

    return command(message, args);
};

exports.category = categories.DB;
