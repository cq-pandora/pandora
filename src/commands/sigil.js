const {
    fileDb: { sigilsFuzzy, followPath },
    functions: { getPrefix, parseQuery },
    categories,
    cmdResult,
} = require('../util');
const SigilsListEmbed = require('../embeds/SigilsEmbed');

const instructions = (message) => {
    const prefix = getPrefix(message);
    const e = {
        title: `${prefix}sigil <name>`,
        fields: [
            {
                name: '<name>',
                value: `Get sigil data.\n*e.g. ${prefix}sigil refusal*`
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

    const candidates = sigilsFuzzy.search(name);

    if (!candidates.length) {
        return message.channel
            .send('Sigil not found!')
            .then(m => ({
                status_code: cmdResult.ENTITY_NOT_FOUND,
                target: 'sigil',
            }));
    }

    const sigils = candidates.map(c => followPath(c.path));

    return new SigilsListEmbed(message, sigils).send()
        .then(m => ({
            status_code: cmdResult.SUCCESS,
            target: sigils.map(s => s.id).join(','),
            arguments: JSON.stringify({ name: name }),
        }));
};

exports.run = (message, args) => {
    if (!args.length) { return instructions(message); }

    return command(message, args);
};

exports.category = categories.DB;
