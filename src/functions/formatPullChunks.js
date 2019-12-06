const _ = require('lodash');

const { translate } = require('../util/cq-data');

const {
	emojis: {
		mini_contract: miniContract,
		mini_promotable: miniPromotable,
		mini_brown: miniBrown,
		mini_event: miniEvent,
		mini_supply: miniSupply,
	}
} = require('../config');

module.exports = (pull, canBeGuaranteed = true) => _.chunk(
	pull.map(
		(form, idx) => {
			if (form.star < 4) {
				return `${miniBrown}${translate(form.name)} (${form.star}★)`;
			}

			switch (form.hero.type) {
			case 'contract':
				return `**${miniContract}${translate(form.name)} (${form.star}★)${((idx + 1) % 10 && canBeGuaranteed) ? '**' : ' (Guaranteed)**'}`;
			case 'promotable':
				return `*${miniPromotable}${translate(form.name)} (${form.star}★)*`;
			case 'collab':
			case 'secret':
				return `*${miniEvent}${translate(form.name)} (${form.star}★)*`;
			default:
				return `*${miniSupply}${translate(form.name)} (${form.star}★)*`;
			}
		}
	),
	10
);
