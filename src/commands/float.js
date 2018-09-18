const {
    fileDb: { fishingGearFuzzy, followPath },
    functions: { getPrefix, parseQuery },
    categories,
    cmdResult,
} = require('../util');
const FishingGearListEmbed = require('../embeds/FishingGearListEmbed');

const instructions = (message) => {
    const prefix = getPrefix(message);
    const e = {
        title: `${prefix}float <name>`,
        fields: [
            {
                name: '<name>',
                value: `Get float data`
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

    const floats = candidates
        .map(c => followPath(c.path))
        .filter(b => b.type === 'float');

    if (!floats.length) {
        return message.channel
            .send('Float not found!')
            .then(m => ({
                status_code: cmdResult.ENTITY_NOT_FOUND,
                target: 'float',
            }));
    }

    return new FishingGearListEmbed(message, floats).send()
        .then(m => ({
            status_code: cmdResult.SUCCESS,
            target: floats.map(f => f.id).join(','),
            arguments: JSON.stringify({ name: name }),
        }));
};

exports.run = (message, args) => {
    if (!args.length) { return instructions(message); }

    return command(message, args);
};

exports.category = categories.DB;
