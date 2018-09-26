const range = require('./range');

module.exports = args => (
	parseInt(args.find(i => range(1, 6).includes(parseInt(i, 10))), 10) || null
);
