const beautify = require('js-beautify').js_beautify;
const { categories, cmdResult } = require('../util');

const evaluate = (message, args) => {
    let input = args.join(' ');

    if (input.toLowerCase().includes('token') || input.toLowerCase().includes('eval')) {
        return message.channel.send({
            description: 'This is a bad idea.'
        }).then(m => ({
            status_code: cmdResult.NOT_ENOUGH_PERMISSIONS,
            target: 'script',
            arguments: JSON.stringify({ input: args.join(' ') }),
        }));
    }

    input = beautify(input, {
        indent_size: 2
    });

    let output;
    let err = false;

    try {
        output = eval(input); // eslint-disable-line no-eval
    } catch (error) {
        err = output = error;
    }

    return message.channel.send({
        fields: [{
            name: 'Input',
            value: '```js\n' + input + '```'
        }, {
            name: 'Output',
            value: '```\n' + output + '```'
        } ]
    }).then(m => ({
        status_code: err ? cmdResult.UNKNOWN_ERROR : cmdResult.SUCCESS,
        target: 'script',
        arguments: JSON.stringify({ input: args.join(' ') }),
    }));
};

exports.run = evaluate;

exports.protected = true;

exports.category = categories.PROTECTED;
