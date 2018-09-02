const config = require('../config');

exports.run = (message, args) => {
    const cmds = {
        'Bot': [
            //'about',
            'help',
            'ping',
        ],
        'Database': [
            'berry',
            'block',
            'faction',
            'goddess',
            'hero',
            'inherit',
            'portrait',
            'sbw',
            'sbw-block'
            'sigil',
            'skin',
            'sp-skill',
        ],
        'Utility': [
            'fergus',
            'links',
            'pick',
            'alias',
            'translate',
        ],
        'Miscellaneous': [
            'lenny',
            'math',
            'print',
        ],
        'Reserved': [
            'eval',
            'manage-aliases',
            'manage-translations',
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