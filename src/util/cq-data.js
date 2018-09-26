const Fuse = require('fuse.js');

const { join: pathJoin, resolve: pathResolve } = require('path');

const { aliases, parsedData } = require('../config');

const parsedDataDir = pathResolve(parsedData);
const requireFile = path => require(pathJoin(parsedDataDir, `${path}.json`));

const fuzzyIndices = requireFile('translations_indices');
const fuzzyOptions = {
	threshold: 0.2,
	location: 0,
	distance: 100,
	maxPatternLength: 32,
	minMatchCharLength: 1,
	keys: ['text']
};

const translations = requireFile('translations');

const alias = key => (
	key
		? aliases[key.toLowerCase()] || key
		: ''
);

const aliasFuse = (fuse) => {
	const oldSearch = fuse.search;

	fuse.search = a => oldSearch.call(fuse, alias(a));

	return fuse;
};

function followPath(path, outputArray) {
	const [oneKey, twoKey] = path.split('.');
	const ids = twoKey.split(',');

	if (ids.length === 1) {
		return outputArray
			? [this[oneKey][twoKey]]
			: this[oneKey][twoKey];
	}

	return outputArray
		? ids.map(id => this[oneKey][id])
		: this[oneKey][ids[0]];
}

module.exports = {
	bosses: requireFile('bosses'),
	berries: requireFile('berries'),
	breads: requireFile('breads'),
	weapons: requireFile('generic_weapons'),
	heroes: requireFile('heroes'),
	sigils: requireFile('sigils'),
	goddesses: requireFile('goddesses'),
	factions: requireFile('factions'),
	inheritance: requireFile('inheritance'),
	keysDescriptions: requireFile('heroes_translations_indices'),
	champions: requireFile('champions'),
	sp_skills: requireFile('sp_skills'),
	fishes: requireFile('fishes'),
	fishing_gear: requireFile('fishing_gear'),
	fishing_ponds: requireFile('fishing_ponds'),
	translations,
	translate: key => (translations[key] ? (translations[key].text || '') : (key || '')).replace(/[@#$^]/g, ''),
	fuzzyIndices,
	heroesFuzzy: aliasFuse(new Fuse(fuzzyIndices.heroes, fuzzyOptions)),
	championsFuzzy: aliasFuse(new Fuse(fuzzyIndices.champions, fuzzyOptions)),
	spSkillsFuzzy: aliasFuse(new Fuse(fuzzyIndices.sp_skills, fuzzyOptions)),
	bossesFuzzy: aliasFuse(new Fuse(fuzzyIndices.bosses, fuzzyOptions)),
	breadsFuzzy: new Fuse(fuzzyIndices.breads, fuzzyOptions),
	berriesFuzzy: new Fuse(fuzzyIndices.berries, fuzzyOptions),
	sigilsFuzzy: aliasFuse(new Fuse(fuzzyIndices.sigils, fuzzyOptions)),
	goddessesFuzzy: new Fuse(fuzzyIndices.goddesses, fuzzyOptions),
	factionsFuzzy: new Fuse(fuzzyIndices.factions, fuzzyOptions),
	fishesFuzzy: new Fuse(fuzzyIndices.fishes, fuzzyOptions),
	fishingGearFuzzy: new Fuse(fuzzyIndices.fishing_gear, fuzzyOptions),
	fishingPondsFuzzy: new Fuse(fuzzyIndices.fishing_ponds, fuzzyOptions),
};

module.exports.followPath = followPath.bind(module.exports);
