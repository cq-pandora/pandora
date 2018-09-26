module.exports = (stat1, stat2) => {
	const stats = {};

	for (const stat of Object.keys(stat1 || {})) {
		stats[stat] = (stat1[stat] || 0) + (stat2[stat] || 0);
	}

	return stats;
};
