const {
    fileDb: { berriesFuzzy, berries, translate },
    functions: { getPrefix, capitalizeFirstLetter, imageUrl, parseGrade, parseQuery },
    categories,
    cmdResult,
} = require('../util');
const { MessageEmbed } = require('discord.js');

const instructions = (message) => {
    const prefix = getPrefix(message);
    const e = {
        title: `${prefix}berry [<name>] [<star>]`,
        fields: [
            {
                name: '<name>',
                value: `Get berry data.\n*e.g. ${prefix}berry almighty berry*`
            },
            {
                name: '<star>',
                value: `Filter berries by <star>.\n*e.g. ${prefix}berry almighty berry 4*`
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

    const candidates = berriesFuzzy.search(name);

    if (!candidates.length) {
        return message.channel
            .send('Berry not found!')
            .then(m => ({
                status_code: cmdResult.ENTITY_NOT_FOUND,
                arguments: JSON.stringify({ name: name, grade: grade }),
            }));
    }

    const berry = grade ? candidates.map(c => berries[c.path]).filter(b => b.grade === grade)[0]
        : berries[candidates[0].path];

    if (!berry) {
        return message.channel
            .send('Berry grade not found!')
            .then(m => ({
                status_code: cmdResult.ENTITY_GRADE_NOT_FOUND,
                arguments: JSON.stringify({ name: name, grade: grade }),
            }));
    }

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
        .then(m => ({
            status_code: cmdResult.SUCCESS,
            target: berry.id,
            arguments: JSON.stringify({ name: name, grade: grade }),
        }));
};

exports.run = (message, args) => {
    if (!args.length) { return instructions(message); }

    return command(message, args);
};

exports.category = categories.DB;
