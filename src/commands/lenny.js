const { categories, cmdResult } = require('../util');

exports.run = (message, args) => {
    const e = {
        description: '( ͡° ͜ʖ ͡°)'
    };

    return message.channel.send({ embed: e })
        .then(m => ({
            status_code: cmdResult.SUCCESS,
            target: 'lenny',
        }));
};

exports.category = categories.MISC;
