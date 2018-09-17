const {
    fileDb: { heroesFuzzy, followPath},
    functions: { getPrefix, parseGrade, parseQuery },
    categories,
    cmdResult,
    PaginationEmbed,
} = require('../util');
const HeroBlockEmbed = require('../embeds/HeroBlockEmbed');

const instructions = (message) => {
    const prefix = getPrefix(message);
    const e = {
        title: `${prefix}block [<name>] [<star>]`,
        fields: [{
            name: '<name>',
            value: `Get block data.\n*e.g. ${prefix}block lee*`
        }, {
            name: '<star>',
            value: `Filter heroes by <star>. If omitted, defaults to highest form.\n*e.g. ${prefix}block lee 4*`
        } ]
    };

    return message.channel.send({ embed: e })
        .then(m => ({
            status_code: cmdResult.NOT_ENOUGH_ARGS,
        }));
};

const command = (message, args) => {
    const grade = parseGrade(args);
    const name = parseQuery(args, [`${grade}`]);

    const candidates = heroesFuzzy.search(name);

    if (!candidates.length) {
        return message.channel
            .send('Hero not found!')
            .then(m => ({
                status_code: cmdResult.ENTITY_NOT_FOUND,
            }));
    }

    const hero = followPath(candidates[0].path);

    let form = null;

    if (grade) {
        form = hero.forms.filter(f => f.star === grade)[0];
    } else {
        form = hero.forms[hero.forms.length - 1];
    }

    if (!form) {
        return message.channel
            .send('Hero grade not found!')
            .then(m => ({
                status_code: cmdResult.ENTITY_GRADE_NOT_FOUND,
            }));
    }

    const page = hero.forms.indexOf(form) + 1;

    return new HeroBlockEmbed(message, hero, page).send()
        .then(m => ({
            status_code: cmdResult.SUCCESS,
            target: hero.id,
            arguments: JSON.stringify({ name: name, grade: grade }),
        }));
};

exports.run = (message, args) => {
    if (!args.length) { return instructions(message); }

    return command(message, args);
};

exports.category = categories.DB;
