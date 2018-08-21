const Discord = require('discord.js');
const config = require('./config');

// create bot
const client = new Discord.Client();

// load event handlers
require('./util/loadEvents.js')(client);

client.login(config.token);
