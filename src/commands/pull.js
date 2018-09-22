const _ = require('lodash');
const { MessageAttachment, MessageEmbed } = require('discord.js');

const { random, makeInRange, makePullImage, pickGrade } = require('../functions');
const {
    categories,
    cmdResult,
    fileDb: { heroes, translate }
} = require('../util');

const {
    emojis: {
        mini_contract: miniContract,
        mini_promotable: miniPromotable,
        mini_brown: miniBrown
    }
} = require('../config');

const HEROES_HIDDEN = [
    'legendary',
    'limited',
    'secret'
];

const forms = _.flatten(heroes
    .filter(hero => hero.type && !HEROES_HIDDEN.includes(hero.type))
    .map(hero => (
        hero.forms.map(form => {
            form.hero = hero;

            return form;
        })
    ))
);

const sortedForms = {};

for (const key of [3, 4, 5, 6]) {
    sortedForms[key] = forms.filter(form => (
        Number(form.star) === key
    ));
}

sortedForms.guaranteed = sortedForms[4].filter(f => f.hero.type === 'contract');

const command = async (message, [min]) => {
    const pull = Array(makeInRange((Number(min) || 10), 1, 20))
        .fill()
        .map((_, idx) => {
            if ((1 + idx) % 10) {
                const grade = pickGrade();

                return sortedForms[grade][random(0, sortedForms[grade].length - 1)];
            } else {
                return sortedForms.guaranteed[random(0, sortedForms.guaranteed.length - 1)];
            }
        });

    const canvas = await makePullImage(pull);

    const chunks = _.chunk(
        pull.map(
            (form, idx) => {
                if (form.star < 4) {
                    return `${miniBrown}${translate(form.name)} (${form.star}★)`;
                }

                if (form.hero.type === 'contract') {
                    return `**${miniContract}${translate(form.name)} (${form.star}★)${(idx + 1) % 10 ? '**' : ' (Guaranteed)**'}`;
                }

                return `*${miniPromotable}${translate(form.name)} (${form.star}★)*`;
            }
        ),
        10
    );

    const embed = new MessageEmbed()
        .setAuthor(`${message.author.username}#${message.author.discriminator}`, message.author.avatarURL)
        .setImage('attachment://pull.png');

    for (const chunk of chunks) {
        embed.addField('\u200b', chunk.join('\n'));
    }

    await message.channel.send({
        embed,
        files: [
            new MessageAttachment(await canvas.getBufferAsync('image/png'), 'pull.png')
        ]
    });

    return {
        status_code: cmdResult.SUCCESS,
        target: 'pull',
        arguments: JSON.stringify({ }),
    };
};

exports.run = (message, args) => command(message, args);

exports.category = categories.MISC;
