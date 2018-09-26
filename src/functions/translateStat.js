const statsNameMapping = {
	atk_power: 'Attack power',
	hp: 'HP',
	crit_chance: 'Crit chance',
	armor: 'Armor',
	resistance: 'Resistance',
	crit_dmg: 'Crit damage',
	accuracy: 'Accuracy',
	evasion: 'Evasion',
	armor_pen: 'Armor penetration',
	resistance_pen: 'Resistance penetration',
	dmg_reduction: 'Damage reduction',
	lifesteal: 'Lifesteal',
	crit_chance_reduction: 'Crit chance reduction',
	All: 'All',
	all: 'All'
};

module.exports = stat => statsNameMapping[stat] || stat;
