const beautify = require('js-beautify').js_beautify;
const config = require('../config');

evaluate = (message, args) => {
    let input = args.join(' ');
    if (input.toLowerCase().includes('token') || input.toLowerCase().includes('eval')) {
        return {
            description: 'This is a bad idea.',
        };
    }

    input = beautify(input, {
        indent_size: 2,
    });
    let output;
    try {
        output = eval(input);
    } catch (error) {
        output = error;
    }

    return {
        fields: [{
            name: 'Input',
            value: '```js\n' + input + '```',
        }, {
            name: 'Output',
            value: '```\n' + output + '```',
        }, ],
    };
}

exports.run = (message, args) => {
    if (message.author.id !== config.owner_id) {
        return;
    }

    const e = evaluate(message, args);

    message.channel.send({
        embed: e,
    });
}