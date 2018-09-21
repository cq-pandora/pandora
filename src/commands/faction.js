const { getPrefix } = require('../functions');
const {
    fileDb: { factionsFuzzy, followPath },
    categories,
    cmdResult,
} = require('../util');
const { FactionsEmbed } = require('../embeds');

const instructions = (message) => {
    const prefix = getPrefix(message);
    const msg = {
        title: `${prefix}faction [<name>]`,
        fields: [
            {
                name: '<name>',
                value: `Get faction data.\n*e.g. ${prefix}faction han*`
            }
        ]
    };

    return message.channel
        .send({ embed: msg })
        .then(m => ({
            status_code: cmdResult.NOT_ENOUGH_ARGS,
        }));
};

const command = (message, args) => {
    const name = args.join(' ');

    const candidates = factionsFuzzy.search(name);

    if (!candidates.length) {
        return message.channel
            .send('Faction not found!')
            .then(m => ({
                status_code: cmdResult.ENTITY_NOT_FOUND,
            }));
    }

    const factions = candidates.map(c => followPath(c.path));

    return new FactionsEmbed(message, factions).send()
        .then(m => ({
            status_code: cmdResult.SUCCESS,
            target: factions.map(f => f.id).join(','),
            arguments: JSON.stringify({ name: name }),
        }));
};

exports.run = (message, args) => {
    if (!args.length) { return instructions(message); }

    return command(message, args);
};

exports.category = categories.DB;
