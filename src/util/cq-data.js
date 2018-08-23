const config = require('../config');
const path = require('path');
const Fuse = require('fuse.js');

const requireFile = (f) => require(path.resolve(config.parsedData, f + '.json'));

const fuzzyIndicies = requireFile('translations_indicies');
const fuzzyOptions = { 
    threshold: 0.2,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: [ "text" ],
};

const translations = requireFile('translations');

module.exports = {
	berries: requireFile('berries'),
	breads: requireFile('breads'),
	weapons: requireFile('generic_weapons'),
	heroes: requireFile('heroes_forms_with_sbw_and_skins'),
	sigils: requireFile('sigils'),
	goddesses: requireFile('goddesses'),
	factions: requireFile('factions'),
	translations: translations,
	translate: (key) => translations[key] ? translations[key].text : key,
	fuzzyIndicies: fuzzyIndicies,
	heroesFuzzy: new Fuse(fuzzyIndicies.heroes, fuzzyOptions),
	breadsFuzzy: new Fuse(fuzzyIndicies.breads, fuzzyOptions),
	berriesFuzzy: new Fuse(fuzzyIndicies.berries, fuzzyOptions),
	sigilsFuzzy: new Fuse(fuzzyIndicies.sigils, fuzzyOptions),
	goddessesFuzzy: new Fuse(fuzzyIndicies.goddesses, fuzzyOptions),
	factionsFuzzy: new Fuse(fuzzyIndicies.factions, fuzzyOptions),
}