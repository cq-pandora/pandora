const {
    fileDb: { fishesFuzzy, followPath },
    functions: { getPrefix, parseQuery },
    categories,
    cmdResult,
    PaginationEmbed,
} = require('../util');

const FishListEmbed = require('../embeds/FishListEmbed');

const instructions = (message) => {
    const prefix = getPrefix(message);
    const e = {
        title: `${prefix}fish [<name>]`,
        fields: [
            {
                name: '<name>',
                value: `Get fish data`
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

    const candidates = fishesFuzzy.search(name);

    if (!candidates.length) {
        return message.channel
            .send('Fish not found!')
            .then(m => ({
                status_code: cmdResult.ENTITY_NOT_FOUND,
            }));
    }

    const fishes = candidates.map(c => followPath(c.path));

    return new FishListEmbed(message, fishes).send()
        .then(m => ({
            status_code: cmdResult.SUCCESS,
            target: fishes.map(f => f.id).join(','),
            arguments: JSON.stringify({ name: name }),
        }));
};

exports.run = (message, args) => {
    if (!args.length) { return instructions(message); }

    return command(message, args);
};

exports.category = categories.DB;
