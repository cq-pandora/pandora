const { Embeds: EmbedsMode } = require('discord-paginationembed');
const { MessageEmbed } = require('discord.js');
const { heroesFuzzy, heroes, translate } = require('../util/cq-data');
const { getPrefix, textSplitter, capitalizeFirstLetter, imageUrl, parseGrade, parseQuery  } = require('../util/shared');
const _ = require('lodash');

const classColors = {
    archer: 0x79B21D,
    hunter: 0xDAA628,
    paladin: 0x24A2BF,
    priest: 0xF163B3,
    warrior: 0xB43026,
    wizard: 0x985ED5,
};

const instructions = (message) => {
    const prefix = getPrefix(message);
    const e = {
        title: `${prefix}block [<name>] [<star>]`,
        fields: [{
            name: '<name>',
            value: `Get block data.\n*e.g. ${prefix}block lee*`,
        }, {
            name: '<star>',
            value: `Filter heroes by <star>. If omitted, defaults to highest form.\n*e.g. ${prefix}block lee 4*`,
        }, ],
    };

    message.channel.send({
        embed: e,
    });
};

const command = (message, args) => {
    const grade = parseGrade(args);
    const name = parseQuery(args, [grade]);

    const candidates = heroesFuzzy.search(name);

    if (!candidates.length) {
        return message.channel
            .send('Hero not found!')
            .catch(error => console.log(error));
    }

    const hero = heroes[candidates.map(c => parseInt(c.path.split('.')[0]))[0]];
    
    let form = null;

    if (grade) {
        form = hero.forms.filter(f => f.star == grade)[0];
    } else {
        form = hero.forms[hero.forms.length - 1];
    }

    if (!form)
        return message.channel
            .send('Hero grade not found!')
            .catch(error => console.log(error));

    const page = hero.forms.indexOf(form) + 1;

    const embeds = hero.forms.map((form, idx, arr) => 
        _.reduce(form.passive_name ? textSplitter(translate(form.passive_description)) : [],
        (res, chunk, idx) => res.addField(idx ? '\u200b' : translate(form.passive_name), chunk),
        new MessageEmbed()
            .setTitle(`${translate(form.name)} (${form.star}★)`)
            .setThumbnail(imageUrl('skills/' + form.block_image))
            .setFooter(`Page ${idx + 1}/${arr.length}`)
            .addField(`${translate(form.block_name)} (Lv. ${form.skill_lvl})`, translate(form.block_description))
    ));

    
    return EmbedsMode()
        .setArray(embeds)
        .setAuthorizedUsers([message.author.id])
        .setChannel(message.channel)
        .setPage(page)
        .showPageIndicator(false)
        .setDisabledNavigationEmojis(['JUMP'])
        .setColor(classColors[hero.class])
        .build();
};

exports.run = (message, args) => {
    if (!args.length)
        return instructions(message);

    return command(message, args);
};