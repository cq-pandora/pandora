const {
    fileDb: { fishingGearFuzzy, followPath },
    functions: { getPrefix, parseQuery },
    categories,
    cmdResult,
} = require('../util');

const BaitListEmbed = require('../embeds/BaitListEmbed');

const instructions = (message) => {
    const prefix = getPrefix(message);
    const e = {
        title: `${prefix}bait <name>`,
        fields: [
            {
                name: '<name>',
                value: `Get bait data`
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

    const candidates = fishingGearFuzzy.search(name);

    if (!candidates.length) {
        return message.channel
            .send('Bait not found!')
            .then(m => ({
                status_code: cmdResult.ENTITY_NOT_FOUND,
                target: 'bait',
            }));
    }

    const baits = candidates
        .map(c => followPath(c.path))
        .filter(b => b.type === 'bait');

    if (!baits.length) {
        return message.channel
            .send('Bait not found!')
            .then(m => ({
                status_code: cmdResult.ENTITY_NOT_FOUND,
                target: 'bait',
            }));
    }

    return new BaitListEmbed(message, baits)
        .send()
        .then(m => ({
            status_code: cmdResult.SUCCESS,
            target: baits.map(f => f.id).join(','),
            arguments: JSON.stringify({ name: name }),
        }));
};

exports.run = (message, args) => {
    if (!args.length) { return instructions(message); }

    return command(message, args);
};

exports.category = categories.DB;
