const { categories } = require('../util');

exports.run = (message, args) => {
    const e = {
        image: {
            url: message.client.user.avatarURL
        }
    };

    message.channel.send({
        embed: e
    });
};

exports.category = categories.MISC;
