const { categories, cmdResult } = require('../util');

exports.run = (message, args) => {
    const e = {
        image: {
            url: message.client.user.avatarURL
        }
    };

    return message.channel.send({ embed: e })
        .then(m => ({
            status_code: cmdResult.SUCCESS,
            target: 'fergus',
        }));
};

exports.category = categories.MISC;
