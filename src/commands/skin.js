const {
    fileDb: { heroesFuzzy, followPath },
    functions: { getPrefix, parseQuery },
    categories,
    cmdResult,
} = require('../util');
const HeroSkinsEmbed = require('../embeds/HeroSkinsEmbed');

const instructions = (message) => {
    const prefix = getPrefix(message);
    const e = {
        title: `${prefix}skin [<name>]`,
        fields: [
            {
                name: '<name>',
                value: `Get skin data.\n*e.g. ${prefix}skin lee*`
            }
        ],
    };

    return message.channel.send({ embed: e })
        .then(m => ({
            status_code: cmdResult.NOT_ENOUGH_ARGS,
        }));
};

const command = (message, args) => {
    const name = parseQuery(args);
    const candidates = heroesFuzzy.search(name);

    if (!candidates.length) {
        return message.channel
            .send('Hero not found!')
            .then(m => ({
                status_code: cmdResult.ENTITY_NOT_FOUND,
                target: 'hero',
            }));
    }

    const hero = followPath(candidates[0].path);

    return new HeroSkinsEmbed(message, hero).send()
        .then(m => ({
            status_code: cmdResult.SUCCESS,
            target: hero.id,
            arguments: JSON.stringify({ name: name }),
        }));
};

exports.run = (message, args) => {
    if (!args.length) { return instructions(message); }

    return command(message, args);
};

exports.category = categories.DB;
