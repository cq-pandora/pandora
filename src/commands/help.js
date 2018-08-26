const config = require('../config');

exports.run = (message, args) => {
    const cmds = {
        'Bot': [
            //'about',
            'help',
            'ping',
        ],
        'Database': [
            'block',
            'faction',
            'goddess',
            'hero',
            'portrait',
            'inherit',
            'sbw',
            'skin',
        ],
        'Utility': [
            'fergus',
            'links',
            'pick',
        ],
        'Miscellaneous': [
            'lenny',
            'math',
            'print',
        ],
        'Reserved': [
            'eval',
        ],
    };

    const e = {
        title: 'Commands',
        description: `Prefix: ${config.prefix}, ${message.client.user}`,
        fields: Object.keys(cmds).map(currentValue => {
            return {
                name: currentValue,
                value: cmds[currentValue].join(', '),
                inline: false,
            };
        }),
        /*footer: {
            text: `Android ${config.android_version} | iOS ${config.ios_version}`,
        },
        */
    };

    message.channel.send({
        embed: e,
    });
}