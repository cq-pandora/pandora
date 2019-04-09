const { getPrefix, parseQuery } = require('../functions');
const {
	fileDb: { berriesFuzzy, followPath },
	categories,
	cmdResult,
} = require('../util');
const BerriesListEmbed = require('../embeds/BerriesEmbed');

const instructions = async (message) => {
	const prefix = getPrefix(message);

	const embed = {
		title: `${prefix}berry <name>`,
		fields: [
			{
				name: '<name>',
				value: `Get berry data.\n*e.g. ${prefix}berry almighty berry*`
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

	const candidates = berriesFuzzy.search(name);

	if (!candidates.length) {
		await message.channel.send('Berry not found!');

		return {
			status_code: cmdResult.ENTITY_NOT_FOUND,
			arguments: JSON.stringify({ name }),
		};
	}

	const berries = candidates.map(c => followPath(c.path));

	const embed = new BerriesListEmbed(message, berries);

	await embed.send();

	return {
		status_code: cmdResult.SUCCESS,
		target: berries.map(b => b.id).join(','),
		arguments: JSON.stringify({ name }),
	};
};

exports.run = ({ message, args }) => (
	!args.length
		? instructions(message)
		: command(message, args)
);

exports.category = categories.DB;
