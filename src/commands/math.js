const math = require('mathjs');
const { getPrefix } = require('../functions');
const {
    categories,
    cmdResult,
} = require('../util');

const mathInstructions = (message) => {
    const prefix = getPrefix(message);
    return message.channel.send({
        title: `${prefix}math [<expression>]`,
        footer: {
            text: 'Visit http://mathjs.org/ for examples.'
        },
        fields: [{
            name: '<expression>',
            value: `Resolve <expression>.\n*e.g. ${prefix}math 2 + 2*`
        } ]
    }).then(m => ({
        status_code: cmdResult.NOT_ENOUGH_ARGS,
    }));
};

const mathInfo = (message, args) => {
    const problem = args.join(' ');
    let result = null;
    let err = false;

    try {
        result = math.eval(problem).toString();
    } catch (error) {
        result = error.toString();
        err = true;
    }

    return message.channel.send({
        embed: {
            description: result
        },
    }).then(m => ({
        status_code: err ? cmdResult.UNKNOWN_ERROR : cmdResult.SUCCESS,
        target: 'math',
        arguments: JSON.stringify({ problem: problem }),
    }));
};

exports.run = (message, args) => {
    return !args.length ? mathInstructions(message) : mathInfo(message, args);
};

exports.category = categories.MISC;
