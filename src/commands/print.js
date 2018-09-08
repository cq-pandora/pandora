const { getPrefix } = require('../util/shared.js');
const categories = require('../util/categories');

const printInstructions = (message) => {
    const prefix = getPrefix(message);
    return {
        title: `${prefix}print [<text>]`,
        fields: [{
            name: '<text>',
            value: `Print <text> anonymously.\n*e.g. ${prefix}print hello world*`
        } ]
    };
};

const printMessage = (message, args) => {
    message.delete();
    return {
        description: args.join(' ')
    };
};

exports.run = (message, args) => {
    const e = !args.length ? printInstructions(message) : printMessage(message, args);

    message.channel.send({
        embed: e
    });
};

exports.category = categories.MISC;
