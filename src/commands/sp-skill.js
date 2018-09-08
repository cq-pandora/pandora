const { Embeds: EmbedsMode } = require('discord-paginationembed');
const { MessageEmbed } = require('discord.js');
const { spSkillsFuzzy, spSkills, translate } = require('../util/cq-data');
const { getPrefix, imageUrl, parseGrade, parseQuery } = require('../util/shared');
const categories = require('../util/categories');

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

    message.channel.send({
        embed: e
    });
};

const command = (message, args) => {
    const grade = parseGrade(args);
    const name = parseQuery(args, [`${grade}`]);

    const candidates = spSkillsFuzzy.search(name);

    if (!candidates.length) {
        return message.channel
            .send('Skill not found!')
            .catch(error => console.log(error));
    }

    const skill = spSkills[candidates.map(c => c.path)[0]];

    let form = null;

    if (grade) {
        form = skill.forms.filter(f => f.level === grade)[0];
    } else {
        form = skill.forms[skill.forms.length - 1];
    }

    if (!form) {
        return message.channel
            .send('No such level for this skill!')
            .catch(error => console.log(error));
    }

    const page = skill.forms.indexOf(form) + 1;

    const embeds = skill.forms.map((form, idx, arr) =>
        new MessageEmbed()
            .setTitle(`${translate(skill.name)} Lvl. ${form.level}`)
            .setDescription(translate(form.description))
            .setThumbnail(imageUrl('skills/' + form.image))
            .setFooter(`Page ${idx + 1}/${arr.length}`)
    );

    return new EmbedsMode()
        .setArray(embeds)
        .setAuthorizedUsers([message.author.id])
        .setChannel(message.channel)
        .setPage(page)
        .showPageIndicator(false)
        .setDisabledNavigationEmojis(['JUMP'])
        .setColor(classColors[form.class])
        .build();
};

exports.run = (message, args) => {
    if (!args.length) { return instructions(message); }

    return command(message, args);
};

exports.category = categories.DB;
