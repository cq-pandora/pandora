const { getPrefix, parseGrade, parseQuery } = require('../functions');
const {
    fileDb: { spSkillsFuzzy, followPath },
    categories,
    cmdResult,
} = require('../util');
const SPSkillEmbed = require('../embeds/SPSkillEmbed');

const instructions = (message) => {
    const prefix = getPrefix(message);
    const e = {
        title: `${prefix}sp-skill <name> [<level>]`,
        fields: [{
            name: '<name>',
            value: `Get special skill data.`
        }, {
            name: '<level>',
            value: `Filter skills by Level. If omitted, defaults to highest level`
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

    const candidates = spSkillsFuzzy.search(name);

    if (!candidates.length) {
        return message.channel
            .send('Skill not found!')
            .then(m => ({
                status_code: cmdResult.ENTITY_NOT_FOUND,
                target: 'spskill',
            }));
    }

    const skill = followPath(candidates[0].path);

    let form = null;

    if (grade) {
        form = skill.forms.filter(f => f.level === grade)[0];
    } else {
        form = skill.forms[skill.forms.length - 1];
    }

    if (!form) {
        return message.channel
            .send('No such level for this skill!')
            .then(m => ({
                status_code: cmdResult.ENTITY_GRADE_NOT_FOUND,
                target: skill.id,
            }));
    }

    const page = skill.forms.indexOf(form) + 1;

    return new SPSkillEmbed(message, skill, page).send()
        .then(m => ({
            status_code: cmdResult.SUCCESS,
            target: skill.id,
            arguments: JSON.stringify({ name: name, grade: grade }),
        }));
};

exports.run = (message, args) => {
    if (!args.length) { return instructions(message); }

    return command(message, args);
};

exports.category = categories.DB;
