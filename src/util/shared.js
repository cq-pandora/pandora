const config = require('../config');

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

	imageUrl: (filename) => `${config.imagePrefix}${filename}${config.imageSuffix}`,
}