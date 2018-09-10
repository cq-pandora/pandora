const { categories, cmdResult } = require('../util');

exports.run = (message, args) => message.channel
    .send({
        embed: {
            description: 'Pinging...'
        }
    })
    .then(newMessage => {
        newMessage.edit({
            embed: {
                title: 'Pong! 🏓',
                description: `${newMessage.createdTimestamp -
        message.createdTimestamp} ms`
            }
        });
    })
    .then(m => ({
        status_code: cmdResult.SUCCESS,
        target: 'ping',
    }));

exports.category = categories.BOT;
