const contexts = {
	HEROES: 'heroes',
	CHAMPIONS: 'champions',
	SP_SKILLS: 'sp',
	BOSSES: 'bosses',
	BREADS: 'breads',
	BERRIES: 'berries',
	SIGILS: 'sigils',
	COMMANDS: 'commands',
	GODDESSES: 'goddesses',
	FACTIONS: 'factions',
	FISHES: 'fishes',
	FISH_GEAR: 'fish-gear',
	FISH_PONDS: 'fish-ponds',
	PORTRAITS: 'portraits',
};

exports.contexts = contexts;
exports.values = Object.values(contexts).join(', ');
