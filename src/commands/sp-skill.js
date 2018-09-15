const { MessageEmbed } = require('discord.js');
const {
    fileDb: { spSkillsFuzzy, followPath, translate },
    functions: { getPrefix, imageUrl, parseGrade, parseQuery },
    categories,
    cmdResult,
    PaginationEmbed,
} = require('../util');

const classColors = {
    archer: 0x79B21D,
    hunter: 0xDAA628,
    paladin: 0x24A2BF,
    priest: 0xF163B3,
    warrior: 0xB43026,
    wizard: 0x985ED5
};

const instructions = (message) => {
    const prefix = getPrefix(message);
    const e = {
        title: `${prefix}sp-skill [<name>] [<level>]`,
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

    const embeds = skill.forms.map((form, idx, arr) =>
        new MessageEmbed()
            .setTitle(`${translate(skill.name)} Lvl. ${form.level}`)
            .setDescription(translate(form.description))
            .setThumbnail(imageUrl('skills/' + form.image))
            .setFooter(`Page ${idx + 1}/${arr.length}`)
    );

    return new PaginationEmbed(message)
        .setArray(embeds)
        .setAuthorizedUsers([message.author.id])
        .setChannel(message.channel)
        .setPage(page)
        .showPageIndicator(false)
        .setColor(classColors[form.class])
        .build()
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
