const config = require('../config');
const _ = require('lodash');

const statsNameMapping = {
    "atk_power": "Attack power",
    "hp": "HP",
    "crit_chance": "Crit chance",
    "armor": "Armor",
    "resistance": "Resistance",
    "crit_dmg": "Crit damage",
    "accuracy": "Accuracy",
    "evasion": "Evasion",
    "armor_pen": "Armor penetration",
    "resistance_pen": "Resistance penetration",
    "dmg_reduction": "Damage reduction",
    "lifesteal": "Lifesteal",
    "crit_chance_reduction": "Crit chance reduction",
}

module.exports = {
	getPrefix: (message) => !config.prefix ? `@${message.client.user.username} ` : config.prefix,
	
	textSplitter: (str, l) => {
		l = l || 1024;
	    let strs = [];

	    while(str.length > l){
	        let pos = str.substring(0, l).lastIndexOf(' ');
	        pos = pos <= 0 ? l : pos;
	        strs.push(str.substring(0, pos));
	        let i = str.indexOf(' ', pos) + 1;
	        if(i < pos || i > pos + l)
	            i = pos;
	        str = str.substring(i);
	    }

	    strs.push(str);

	    return strs;
	},

	capitalizeFirstLetter: (str) => str ? (str.charAt(0).toUpperCase() + str.substr(1)) : str,

	parseGrade: (args) => parseInt(args.find(i => [1, 2, 3, 4, 5, 6,].includes(parseInt(i, 10)))) || null,

	parseQuery: (args, remove) => _.pullAll(args.filter(i => !!i), remove).join(' '),

	imageUrl: (filename) => `${config.imagePrefix}${filename}${config.imageSuffix}`,

	translateStat: (stat) => statsNameMapping[stat] || stat,
	
	statsToString: (obj) => _.entries(obj).map(el => `${statsNameMapping[el[0]]}: ${el[1] < 1 ? `${el[1] * 100}%` : el[1]}`).join('\n'),
}