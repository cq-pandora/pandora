const _ = require('lodash');

module.exports = (args, remove = []) => (
	_.pullAll(args.filter(i => !!i), remove.map(String)).join(' ')
);
