const { MessageEmbed } = require('discord.js');

const PaginationEmbed = require('./PaginationEmbed');
const { imageUrl } = require('../functions');
const { fileDb: { translate } } = require('../util');

const classColors = {
	archer: 0x79B21D,
	hunter: 0xDAA628,
	paladin: 0x24A2BF,
	priest: 0xF163B3,
	warrior: 0xB43026,
	wizard: 0x985ED5
};

class SPSkillEmbed extends PaginationEmbed {
	constructor(initialMessage, skill, page) {
		super(initialMessage);

		const embeds = skill.forms.map(form => (
			new MessageEmbed()
				.setTitle(`${translate(skill.name)} Lvl. ${form.level}`)
				.setDescription(translate(form.description))
				.setThumbnail(imageUrl(`skills/${form.image}`))
		));

		this.setArray(embeds)
			.showPageIndicator(false)
			.setColor(classColors[skill.forms[0].class]);

		if (page) {
			this.setPage(page);
		}
	}
}

module.exports = SPSkillEmbed;
