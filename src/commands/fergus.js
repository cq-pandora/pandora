const categories = require('../util/categories');

exports.run = (message, args) => {
    const e = {
        image: {
            url: message.client.user.avatarURL,
        },
    };

    message.channel.send({
        embed: e,
    });
}

exports.category = categories.MISC;