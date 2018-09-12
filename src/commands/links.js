const { categories, cmdResult } = require('../util');

exports.run = (message, args) => {
    const e = {
        title: 'Useful Links',
        description: 'Visit the [Crusaders Quest Database (cqdb)](https://goo.gl/fdg6M8)!',
        fields: [
            {
                name: 'Tier Lists',
                value: `[kamakiller's SS2 Overview ](https://goo.gl/yPrKBR)\n[IRC](https://goo.gl/oNQ2iF)\n[TISTORY](https://goo.gl/nOC3NK)\n[INVEN](https://goo.gl/k5PlhB)`,
                inline: true,
            }, {
                name: 'Champions',
                value: `[Vyrlokar](https://goo.gl/M37qRm)`,
                inline: true,
            }, {
                name: 'How To Get',
                value: `[Monuments](https://goo.gl/e10jeA)\n[Lionel's skin](https://goo.gl/9BXBkD)\n[Himiko's skin](https://goo.gl/5yDbjr)`,
                inline: true,
            }, {
                name: 'Challenge',
                value: `[kamakiller](https://goo.gl/bkC85j)\n[Sigils list](http://bit.ly/2NCLFu9)`,
                inline: true,
            }, {
                name: 'LoPF',
                value: `[Nyaa](https://goo.gl/iqppI0)\n[Shintouyu](https://goo.gl/4i8nCb)\n[LoPF map](https://goo.gl/YtlDQH)`,
                inline: true,
            }, {
                name: 'Manacar',
                value: `[kamakiller](https://goo.gl/PbpKdG)\n[Comic](https://goo.gl/aJ8Yoy)`,
                inline: true,
            }, {
                name: 'Hasla Guides',
                value: `[Comics](https://goo.gl/HPsANc)\n[Season 2](https://goo.gl/UQdjhw)\n[Berry system](https://goo.gl/jbgmLa)\n[Math in CQ](https://goo.gl/D5vtS2)`,
                inline: true,
            }, {
                name: 'Miscellaneous',
                value: `[Leveling guide](https://i.redd.it/ya5mgw9xvfk01.jpg)\n[cq-assets](https://goo.gl/UzKBsq)\n[block-map](https://goo.gl/wkYdqt)`,
                inline: true,
            },
        ],
    };

    return message.channel.send({ embed: e })
        .then(m => ({
            status_code: cmdResult.SUCCESS,
            target: 'links',
        }));
};

exports.category = categories.UTIL;
