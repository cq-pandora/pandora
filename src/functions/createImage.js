const Jimp = require('jimp');

module.exports = async (width, height) => (
	new Jimp(width, height, 0x0)
);
