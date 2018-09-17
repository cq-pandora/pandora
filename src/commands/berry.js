const {
    fileDb: { berriesFuzzy, followPath, translate },
    functions: { getPrefix, capitalizeFirstLetter, imageUrl, parseQuery },
    categories,
    cmdResult,
} = require('../util');
const BerriesListEmbed = require('../embeds/BerriesListEmbed');

const instructions = (message) => {
    const prefix = getPrefix(message);
    const e = {
        title: `${prefix}berry <name>`,
        fields: [
            {
                name: '<name>',
                value: `Get berry data.\n*e.g. ${prefix}berry almighty berry*`
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

    const candidates = berriesFuzzy.search(name);

    if (!candidates.length) {
        return message.channel
            .send('Berry not found!')
            .then(m => ({
                status_code: cmdResult.ENTITY_NOT_FOUND,
                arguments: JSON.stringify({ name: name }),
            }));
    }

    const berries = candidates.map(c => followPath(c.path));

    return new BerriesListEmbed(message, berries)
        .send()
        .then(m => ({
            status_code: cmdResult.SUCCESS,
            target: berries.map(b => b.id).join(','),
            arguments: JSON.stringify({ name: name, grade: grade }),
        }));
};

exports.run = (message, args) => {
    if (!args.length) { return instructions(message); }

    return command(message, args);
};

exports.category = categories.DB;
