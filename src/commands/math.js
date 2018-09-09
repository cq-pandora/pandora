const math = require('mathjs');
const {
    functions: { getPrefix },
    categories,
} = require('../util');

const mathInstructions = (message) => {
    const prefix = getPrefix(message);
    return {
        title: `${prefix}math [<expression>]`,
        footer: {
            text: 'Visit http://mathjs.org/ for examples.'
        },
        fields: [{
            name: '<expression>',
            value: `Resolve <expression>.\n*e.g. ${prefix}math 2 + 2*`
        } ]
    };
};

const mathInfo = (args) => {
    try {
        return {
            description: math.eval(args.join(' ')).toString()
        };
    } catch (error) {
        console.log(error);
        return {
            description: error.toString()
        };
    }
};

exports.run = (message, args) => {
    const e = !args.length ? mathInstructions(message) : mathInfo(args);

    message.channel.send({
        embed: e
    });
};

exports.category = categories.MISC;
