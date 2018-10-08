const random = require('./random');

module.exports = (chances) => {
	let sum = 0;

	for (const key of Object.getOwnPropertyNames(chances)) {
		sum += chances[key];
	}

	const roll = random(0, sum - 1);

	let shift = 0;

	for (const form of Object.getOwnPropertyNames(chances)) {
		if (shift <= roll && roll < shift + chances[form]) {
			return form;
		}

		shift += chances[form];
	}

	return null;
};
