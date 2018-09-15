const config = require('../config');
const path = require('path');
const Fuse = require('fuse.js');

const requireFile = (f) => require(path.resolve(config.parsedData, f + '.json'));

const fuzzyIndices = requireFile('translations_indices');
const fuzzyOptions = {
    threshold: 0.2,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: [ 'text' ]
};

const translations = requireFile('translations');

const alias = (key) => config.aliases[key] || key;

const aliasFuse = (fuse) => {
    const oldSearch = fuse.search;
    fuse.search = function (a) { return oldSearch.call(fuse, alias(a)); };
    return fuse;
};

const followPath = function (path) {
    const parts = path.split('.');
    return this[parts[0]][parts[1]];
};

module.exports = {
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
    translations: translations,
    translate: (key) => (translations[key] ? (translations[key].text || '') : key).replace(/[@#$^]/g, ''),
    fuzzyIndices: fuzzyIndices,
    heroesFuzzy: aliasFuse(new Fuse(fuzzyIndices.heroes, fuzzyOptions)),
    championsFuzzy: aliasFuse(new Fuse(fuzzyIndices.champions, fuzzyOptions)),
    spSkillsFuzzy: aliasFuse(new Fuse(fuzzyIndices.sp_skills, fuzzyOptions)),
    breadsFuzzy: new Fuse(fuzzyIndices.breads, fuzzyOptions),
    berriesFuzzy: new Fuse(fuzzyIndices.berries, fuzzyOptions),
    sigilsFuzzy: new Fuse(fuzzyIndices.sigils, fuzzyOptions),
    goddessesFuzzy: new Fuse(fuzzyIndices.goddesses, fuzzyOptions),
    factionsFuzzy: new Fuse(fuzzyIndices.factions, fuzzyOptions)
};

module.exports.followPath = followPath.bind(module.exports);
