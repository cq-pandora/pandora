const { Embeds: EmbedsMode } = require('discord-paginationembed');
const { berriesFuzzy, berries, translate, } = require('../util/cq-data');
const { getPrefix, textSplitter, capitalizeFirstLetter, imageUrl, parseGrade, parseQuery } = require('../util/shared');
const _ = require('lodash');

const instructions = (message) => {
    const prefix = getPrefix(message);
    const e = {
        title: `${prefix}berry [<name>] [<star>]`,
        fields: [
            {
                name: '<name>',
                value: `Get berry data.\n*e.g. ${prefix}berry almighty berry*`,
            },
            {
                name: '<star>',
                value: `Filter berries by <star>.\n*e.g. ${prefix}berry almighty berry 4*`,
            }, 
        ],
    };

    message.channel.send({
        embed: e,
    });
};

const command = (message, args) => {
    const grade = parseGrade(args);
    const name = parseQuery(args, [grade]);

    const candidates = berriesFuzzy.search(name);

    if (!candidates.length) {
        return message.channel
            .send('Berry not found!')
            .catch(error => console.log(error));
    }

    const berry = grade ? candidates.map(c => berries[c.path]).filter(b => b.grade === grade)[0]
                        : berries[candidates[0].path]

    if (!berry) 
        return message.channel
            .send('Berry grade not found!')
            .catch(error => console.log(error));

    const embed = new MessageEmbed()
            .setTitle(`${translate(berry.name)} (${berry.grade}★)`)
            .setThumbnail(imageUrl('berries/' + berry.image))
            .addField('Rarity', capitalizeFirstLetter(berry.rarity), true)
            .addField('Stat', capitalizeFirstLetter(berry.target_stat), true)
            .addField('Great rate', `${(100 * berry.great_chance)}%`, true)
            .addField('Stat value', berry.is_percentage ? `${(100 * berry.value)}%` : berry.value, true)
            .addField('Sell price', berry.sell_cost, true)
            .addField('Eat cost', berry.eat_cost, true);

    return message.channel
        .send(embed)
        .catch(error => console.log(error));
};

exports.run = (message, args) => {
    if (!args.length) 
        return instructions(message);

    return command(message, args);
};