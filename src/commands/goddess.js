const { MessageEmbed } = require('discord.js');
const { goddessesFuzzy, goddesses, translate, } = require('../cq-data');
const { getPrefix, imageUrl } = require('../util/shared');

const instructions = (message) => {
    const prefix = getPrefix(message);
    const msg = {
        title: `${prefix}goddess [<name>]`,
        fields: [
            {
                name: '<name>',
                value: `Get goddess data.\n*e.g. ${prefix}goddess sera*`,
            },
        ],
    };

    return message.channel
        .send({embed: msg})
        .catch(error => console.log(error))
}

const command = (message, args) => {
    const name = args[0];
    
    const candidates = goddessesFuzzy.search(name);

    if (!candidates.length) {
        return message.channel
            .send('Goddess not found!')
            .catch(error => console.log(error));
    }

    const goddess = goddesses[candidates[0].path];

    const msg = new MessageEmbed()
        .setTitle(translate(goddess.name))
        .addField(translate(goddess.skill_name), translate(goddess.skill_description))
        .setThumbnail(imageUrl('heroes/' + goddess.image));

    return message.channel
        .send(msg)
        .catch(error => console.log(error));
};

exports.run = (message, args) => {
    if (!args.length) 
        return instructions(message);

    return command(message, args);
};