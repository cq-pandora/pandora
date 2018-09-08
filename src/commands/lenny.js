const categories = require('../util/categories');

exports.run = (message, args) => {
    const e = {
        description: '( ͡° ͜ʖ ͡°)'
    };

    message.channel.send({
        embed: e
    });
};

exports.category = categories.MISC;
