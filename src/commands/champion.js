const {
    fileDb: { championsFuzzy, followPath, translate },
    functions: { getPrefix, imageUrl, parseGrade, parseQuery },
    categories,
    cmdResult,
} = require('../util');
const ChampionEmbed = require('../embeds/ChampionEmbed');

const instructions = (message) => {
    const prefix = getPrefix(message);
    const e = {
        title: `${prefix}champion <name> [<grade>]`,
        fields: [
            {
                name: '<name>',
                value: `Get champion data`
            }, {
                name: '<grade>',
                value: `Champion level. Defaults to highest possible`
            }
        ]
    };

    return message.channel.send({ embed: e })
        .then(m => ({
            status_code: cmdResult.NOT_ENOUGH_ARGS,
        }));
};

const command = (message, args) => {
    const grade = parseGrade(args);
    const name = parseQuery(args, [`${grade}`]);

    const candidates = championsFuzzy.search(name);

    if (!candidates.length) {
        return message.channel
            .send('Champion not found!')
            .then(m => ({
                status_code: cmdResult.ENTITY_NOT_FOUND,
            }));
    }

    const champ = followPath(candidates[0].path);

    let form = null;

    if (grade) {
        form = champ.forms.filter(f => f.grade === grade)[0];
    } else {
        form = champ.forms[champ.forms.length - 1];
    }

    if (!form) {
        return message.channel
            .send('Champ level not found!')
            .then(m => ({
                status_code: cmdResult.ENTITY_GRADE_NOT_FOUND,
            }));
    }

    const page = champ.forms.indexOf(form) + 1;

    return new ChampionEmbed(message, champ, page).send()
        .then(m => ({
            status_code: cmdResult.SUCCESS,
            target: champ.id,
            arguments: JSON.stringify({ name: name, grade: grade }),
        }));
};

exports.run = (message, args) => {
    if (!args.length) { return instructions(message); }

    return command(message, args);
};

exports.category = categories.DB;
