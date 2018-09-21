const { getPrefix } = require('../functions');
const {
    categories,
    cmdResult,
    fileDb: {
        berries,
        bosses,
        champions,
        fishes,
        fishing_gear,
        goddesses,
        factions,
        heroes,
        sp_skills,
        sigils,
    }
} = require('../util');

const _ = require('lodash');

const {
    BerriesEmbed,
    BossesEmbed,
    ChampionEmbed,
    FishesEmbed,
    FishingGearsEmbed,
    GoddessesEmbed,
    FactionsEmbed,
    HeroBlockEmbed,
    HeroFormsEmbed,
    HeroSBWEmbed,
    HeroSkinsEmbed,
    PortraitsEmbed,
    SigilsEmbed,
    SPSkillEmbed,
} = require('../embeds');

class Picker {
    constructor (collection, embed, processor = null) {
        this.collection = collection;
        this.embed = embed;
        this.processor = (processor || function () { return this.collection[random(0, this.collection.length - 1)]; }).bind(this);
    }

    pick (message, args = []) {
        // eslint-disable-next-line new-cap
        return new this.embed(message, this.processor(args));
    }
}

const fishingGear = Object.keys(fishing_gear).map(k => fishing_gear[k]);
const fishez = Object.keys(fishes).map(k => fishes[k]);

const pickMapping = {
    berry: new Picker(berries, BerriesEmbed),
    boss: new Picker(bosses, BossesEmbed),
    champion: new Picker(champions, ChampionEmbed),
    fish: new Picker(fishez, FishesEmbed),
    'fishing-gear': new Picker(fishingGear, FishingGearsEmbed),
    rod: new Picker(fishingGear.filter(g => g.type === 'rod'), FishingGearsEmbed),
    bait: new Picker(fishingGear.filter(g => g.type === 'bait'), FishingGearsEmbed),
    float: new Picker(fishingGear.filter(g => g.type === 'float'), FishingGearsEmbed),
    goddess: new Picker(goddesses, GoddessesEmbed),
    faction: new Picker(factions, FactionsEmbed),
    block: new Picker(heroes, HeroBlockEmbed),
    sbw: new Picker(heroes.filter(h => h.sbws.length), HeroSBWEmbed),
    hero: new Picker(heroes, HeroFormsEmbed),
    skin: new Picker(heroes.filter(h => h.skins.length), HeroSkinsEmbed),
    portrait: new Picker(_.flatten(heroes.map(h => h.portraits)), PortraitsEmbed),
    sigil: new Picker(sigils, SigilsEmbed),
    skill: new Picker(sp_skills, SPSkillEmbed),
};

const instructions = (message) => {
    const prefix = getPrefix(message);

    return message.channel.send({
        embed:
            {
                title: `${prefix}pick <collection>`,
                description: 'Pick one entity from selected collection.',
                fields: [
                    {
                        name: '<collection>',
                        value: `Collection to pick from. 
                        Can be one of \`${Object.keys(pickMapping).join(', ')}\``,
                    }
                ]
            }
    }).then(m => ({
        status_code: cmdResult.NOT_ENOUGH_ARGS,
    }));
};

const pickItem = (message, args) => {
    const collection = args.shift();

    const picker = pickMapping[collection];

    if (!picker) {
        return message.channel
            .send('Collection not found!')
            .then(m => ({
                status_code: cmdResult.ENTITY_NOT_FOUND,
                target: 'collection'
            }));
    }

    return picker.pick(message, args).send()
        .then(m => ({
            status_code: cmdResult.SUCCESS,
            target: 'pick',
            arguments: JSON.stringify({ collection: collection }),
        }));
};

exports.run = (message, args) => !args.length ? instructions(message) : pickItem(message, args);

exports.category = categories.MISC;
