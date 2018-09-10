const {
    functions: { getPrefix, random },
    categories,
    cmdResult,
} = require('../util');

const pickInstructions = (message) => {
    const prefix = getPrefix(message);

    return message.channel.send({
        title: `${prefix}pick [<list>]`,
        fields: [
            {
                name: '<list>',
                value: `Pick one item randomly from a comma-separated list.\n*e.g. ${prefix}pick milk, bread, eggs*`,
            }
        ]
    }).then(m => ({
        status_code: cmdResult.NOT_ENOUGH_ARGS,
    }));
};

const pickItem = (message, args) => {
    const list = args.join(' ').split(',');

    return message.channel.send({
        title: 'I pick...',
        description: `${list[random(0, list.length - 1)]}!`
    }).then(m => ({
        status_code: cmdResult.SUCCESS,
        target: 'pick',
        arguments: JSON.stringify({ list: list }),
    }));
};

exports.run = (message, args) => !args.length ? pickInstructions(message) : pickItem(message, args);

exports.category = categories.MISC;
