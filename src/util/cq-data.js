const Fuse = require('fuse.js');

const { join: pathJoin, resolve: pathResolve } = require('path');

const { getAlias, parsedData } = require('../config');
const { contexts } = require('../alias-context');

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

const alias = (ctx, key) => (
	key
		? getAlias(ctx, key.toLowerCase()) || key
		: ''
);

const aliasFuse = (fuse, context) => {
	const oldSearch = fuse.search;

	fuse.search = a => oldSearch.call(fuse, alias(context, a));

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
	portraits: requireFile('portraits'),
	translations,
	translate: key => (translations[key] ? (translations[key].text || '') : (key || '')).replace(/[@#$^]/g, ''),
	fuzzyIndices,
	heroesFuzzy: aliasFuse(new Fuse(fuzzyIndices.heroes, fuzzyOptions), contexts.HEROES),
	championsFuzzy: aliasFuse(new Fuse(fuzzyIndices.champions, fuzzyOptions), contexts.CHAMPIONS),
	spSkillsFuzzy: aliasFuse(new Fuse(fuzzyIndices.sp_skills, fuzzyOptions), contexts.SP_SKILLS),
	bossesFuzzy: aliasFuse(new Fuse(fuzzyIndices.bosses, fuzzyOptions), contexts.BOSSES),
	breadsFuzzy: aliasFuse(new Fuse(fuzzyIndices.breads, fuzzyOptions), contexts.BREADS),
	berriesFuzzy: aliasFuse(new Fuse(fuzzyIndices.berries, fuzzyOptions), contexts.BERRIES),
	sigilsFuzzy: aliasFuse(new Fuse(fuzzyIndices.sigils, fuzzyOptions), contexts.SIGILS),
	goddessesFuzzy: aliasFuse(new Fuse(fuzzyIndices.goddesses, fuzzyOptions), contexts.GODDESSES),
	factionsFuzzy: aliasFuse(new Fuse(fuzzyIndices.factions, fuzzyOptions), contexts.FACTIONS),
	fishesFuzzy: aliasFuse(new Fuse(fuzzyIndices.fishes, fuzzyOptions), contexts.FISHES),
	fishingGearFuzzy: aliasFuse(new Fuse(fuzzyIndices.fishing_gear, fuzzyOptions), contexts.FISH_GEAR),
	fishingPondsFuzzy: aliasFuse(new Fuse(fuzzyIndices.fishing_ponds, fuzzyOptions), contexts.FISH_PONDS),
	portraitsFuzzy: aliasFuse(new Fuse(fuzzyIndices.portraits, fuzzyOptions), contexts.PORTRAITS),
};

module.exports.followPath = followPath.bind(module.exports);
