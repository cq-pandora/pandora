const { getPrefix } = require('../functions');
const {
    categories,
    cmdResult,
} = require('../util');

const printInstructions = (message) => {
    const prefix = getPrefix(message);

    return message.channel.send({
        title: `${prefix}print [<text>]`,
        fields: [{
            name: '<text>',
            value: `Print <text> anonymously.\n*e.g. ${prefix}print hello world*`
        } ]
    }).then(m => ({
        embed: {
            status_code: cmdResult.NOT_ENOUGH_ARGS,
        }
    }));
};

const printMessage = (message, args) => {
    message.delete();
    const text = args.join(' ');

    return message.channel.send({
        embed: {
            description: text
        }
    }).then(m => ({
        status_code: cmdResult.SUCCESS,
        target: 'print',
        arguments: JSON.stringify({ text: text }),
    }));
};

exports.run = (message, args) => {
    return !args.length ? printInstructions(message) : printMessage(message, args);
};

exports.category = categories.MISC;
