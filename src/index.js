const Discord = require('discord.js');
const config = require('./config');
const fs = require('fs');
const path = require('path');

(async function main () {
    const client = new Discord.Client();

    const preloadDir = path.resolve(__dirname, 'preload');
    for (const file of fs.readdirSync(preloadDir)) {
        const entry = require(path.resolve(preloadDir, file));
        await entry(client).catch(e => (console.log('Unable to start app', e), process.exit(entry.errorCode)));
    }

    require('./util/loadEvents.js')(client);

    client.login(config.token);
})();
