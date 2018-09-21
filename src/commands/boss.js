const { getPrefix, parseQuery } = require('../functions');
const {
    fileDb: { bossesFuzzy, followPath },
    categories,
    cmdResult,
} = require('../util');
const BossesListEmbed = require('../embeds/BossesEmbed');

const instructions = (message) => {
    const prefix = getPrefix(message);
    const e = {
        title: `${prefix}boss <boss name>`,
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

    return new BossesListEmbed(message, bosses).send()
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
