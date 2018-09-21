const {
    fileDb: { heroesFuzzy, followPath },
    const { getPrefix, parseQuery, parseInheritance } = require('
    categories,
    cmdResult,
} = require('../util');
const HeroInheritanceEmbed = require('../embeds/HeroInheritanceEmbed');

const instructions = (message) => {
    const prefix = getPrefix(message);
    const e = {
        title: `${prefix}inherit [<name>] [<inheritance level>]`,
        fields: [
            {
                name: '<name>',
                value: `Get hero inheritance stats.\n*e.g. ${prefix}hero lee*`
            },
            {
                name: '<inheritance level>',
                value: `Get hero specific inheritance level stats.\n*e.g. ${prefix}hero lee 7*`
            }
        ]
    };

    return message.channel.send({ embed: e })
        .then(m => ({
            status_code: cmdResult.NOT_ENOUGH_ARGS,
        }));
};

const command = (message, args) => {
    const iLvl = parseInheritance(args);
    const name = parseQuery(args, [iLvl]);

    const candidates = heroesFuzzy.search(name);

    if (!candidates.length) {
        return message.channel
            .send('Hero not found!')
            .then(m => ({
                status_code: cmdResult.ENTITY_NOT_FOUND,
            }));
    }

    const hero = followPath(candidates[0].path);
    const form = hero.forms.filter(f => f.star === 6)[0];

    if (!form) {
        return message.channel
            .send('Hero cannot be inherited!')
            .then(m => ({
                status_code: cmdResult.ENTITY_GRADE_NOT_FOUND,
            }));
    }

    const levels = (iLvl || iLvl === 0) ? [iLvl] : [0, 5, 10, 15, 20];

    return new HeroInheritanceEmbed(message, hero, levels).send()
        .then(m => ({
            status_code: cmdResult.SUCCESS,
            target: hero.id,
            arguments: JSON.stringify({ name: name, inheritance: iLvl }),
        }));
};

exports.run = (message, args) => {
    if (!args.length) { return instructions(message); }

    return command(message, args);
};

exports.category = categories.DB;
