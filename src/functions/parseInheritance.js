const range = require('./range');

module.exports = (args) => (
    parseInt(args.find(i => range(0, 20).includes(parseInt(i, 10)))) || null
);
