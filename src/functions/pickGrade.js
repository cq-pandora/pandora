module.exports = (probabilities = {
	3: 0.81,
	4: 0.149,
	5: 0.035,
	6: 0.006,
}, def = 3) => {
	const roll = Math.random();

	let shift = 0;

	for (const grade of Object.getOwnPropertyNames(probabilities)) {
		if (shift <= roll && roll < shift + probabilities[grade]) {
			return grade;
		}

		shift += probabilities[grade];
	}

	return def;
};
