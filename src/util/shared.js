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
    "All": "All",
    "all": "All"
}

const range = (start, end) => (new Array(end - start + 1)).fill(0).map((_, i) => i + start);

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

	parseGrade: (args) => parseInt(args.find(i => range(1, 6).includes(parseInt(i, 10)))) || null,

	parseInheritance: (args) => parseInt(args.find(i => range(0, 20).includes(parseInt(i, 10)))) || null,

	parseQuery: (args, remove) => _.pullAll(args.filter(i => !!i), remove.map(r => `${r}`)).join(' '),

	imageUrl: (filename) => `${config.imagePrefix}${filename}${config.imageSuffix}`,

	translateStat: (stat) => statsNameMapping[stat] || stat,
	
	statsToString: (obj, force) => _.entries(obj).filter(([_, s]) => (s > 0 || force))
		.map(el => `**${statsNameMapping[el[0]]}**: ${el[1] < 1 ? `${(el[1] * 100).toFixed(2)}%` : el[1].toFixed(2)}`).join('\n'),

	sumStats: (stat1, stat2) => _.reduce(_.keys(stat1 || {}), 
		(res, stat) => (res[stat] = (stat1[stat] || 0) + (stat2[stat] || 0), res), {}),

	random: (min, max) => {
	    min = Math.ceil(min);
	    max = Math.floor(max);
	    return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}