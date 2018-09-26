const translateStat = require('./translateStat');
const toClearNumber = require('./toClearNumber');

module.exports = (obj, force) => (
	Object.entries(obj)
		.filter(([key, value]) => (
			value > 0 || force
		))
		.map(([key, value]) => {
			const name = translateStat(key);
			const statValue = value < 10
				? `${Number((value * 100).toFixed(2))}%`
				: toClearNumber(value.toFixed(2));

			return `**${name}**: ${statValue}`;
		})
		.join('\n')
);
