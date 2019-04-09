const { getPrefix, parseQuery } = require('../functions');
const {
	fileDb: { sigilsFuzzy, followPath },
	categories,
	cmdResult,
} = require('../util');
const SigilsListEmbed = require('../embeds/SigilsEmbed');

const instructions = async (message) => {
	const prefix = getPrefix(message);

	const embed = {
		title: `${prefix}sigil <name>`,
		fields: [
			{
				name: '<name>',
				value: `Get sigil data.\n*e.g. ${prefix}sigil refusal*`
			}
		]
	};

	await message.channel.send({ embed });

	return {
		status_code: cmdResult.NOT_ENOUGH_ARGS,
	};
};

const command = async (message, args) => {
	const name = parseQuery(args);

	const candidates = sigilsFuzzy.search(name);

	if (!candidates.length) {
		await message.channel.send('Sigil not found!');

		return {
			status_code: cmdResult.ENTITY_NOT_FOUND,
			target: 'sigil',
		};
	}

	const sigils = candidates.map(c => followPath(c.path));

	const embed = new SigilsListEmbed(message, sigils);

	await embed.send();

	return {
		status_code: cmdResult.SUCCESS,
		target: sigils.map(s => s.id).join(','),
		arguments: JSON.stringify({ name }),
	};
};

exports.run = ({ message, args }) => (
	!args.length
		? instructions(message)
		: command(message, args)
);

exports.category = categories.DB;
