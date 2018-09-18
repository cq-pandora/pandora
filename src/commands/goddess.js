const {
    fileDb: { goddessesFuzzy, followPath },
    functions: { getPrefix },
    categories,
    cmdResult,
} = require('../util');
const GoddessesListEmbed = require('../embeds/GoddessesListEmbed');

const instructions = (message) => {
    const prefix = getPrefix(message);
    const msg = {
        title: `${prefix}goddess [<name>]`,
        fields: [
            {
                name: '<name>',
                value: `Get goddess data.\n*e.g. ${prefix}goddess sera*`
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

    const candidates = goddessesFuzzy.search(name);

    if (!candidates.length) {
        return message.channel
            .send('Goddess not found!')
            .then(m => ({
                status_code: cmdResult.ENTITY_NOT_FOUND,
            }));
    }

    const goddesses = candidates.map(c => followPath(c.path));

    return new GoddessesListEmbed(message, goddesses).send()
        .then(m => ({
            status_code: cmdResult.SUCCESS,
            target: goddesses.map(g => g.id).join(','),
            arguments: JSON.stringify({ input: args.join(' ') }),
        }));
};

exports.run = (message, args) => {
    if (!args.length) { return instructions(message); }

    return command(message, args);
};

exports.category = categories.DB;
