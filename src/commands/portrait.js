const { getPrefix } = require('../functions');
const {
	fileDb: { heroesFuzzy, followPath },
	categories,
	cmdResult,
} = require('../util');
const PortraitsListEmbed = require('../embeds/PortraitsEmbed');

const instructions = async (message) => {
	const prefix = getPrefix(message);

	const embed = {
		title: `${prefix}portrait [<name>]`,
		fields: [
			{
				name: '<name>',
				value: `Get hero portraits.\n*e.g. ${prefix}portrait leon*`
			}
		]
	};

	await message.channel.send({ embed });

	return {
		status_code: cmdResult.NOT_ENOUGH_ARGS,
	};
};

const command = async (message, args) => {
	const name = args.join(' ');

	const [candidate] = heroesFuzzy.search(name);

	if (!candidate) {
		await message.channel.send('Hero not found!');

		return {
			status_code: cmdResult.ENTITY_NOT_FOUND,
		};
	}

	const hero = followPath(candidate.path);
	if (!hero.portraits.length) {
		await message.channel.send('No portraits available for this hero!');

		return {
			status_code: cmdResult.SUBENTITY_NOT_FOUND,
			target: hero.id,
			arguments: JSON.stringify({ name }),
		};
	}

	const embed = new PortraitsListEmbed(message, hero.portraits);

	await embed.send();

	return {
		status_code: cmdResult.SUCCESS,
		target: hero.id,
		arguments: JSON.stringify({ name }),
	};
};

exports.run = (message, args) => (
	!args.length
		? instructions(message)
		: command(message, args)
);

exports.category = categories.DB;
