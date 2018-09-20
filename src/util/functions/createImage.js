const Jimp = require('jimp');

module.exports = (width, height) => {
    return new Promise((resolve, reject) => {
        new Jimp(width, height, 0x0, function (err, image) {
            if (err) return reject(err);
            resolve(image);
        });
    });
};
