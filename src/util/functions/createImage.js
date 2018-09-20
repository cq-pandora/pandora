const Jimp = require('jimp');

module.exports = (width, height) => Promise.resolve(new Jimp(width, height, 0x0));
