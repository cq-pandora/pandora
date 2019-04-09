const { getPrefix } = require('../functions');
const {
	fileDb: { portraitsFuzzy, followPath },
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

	const [candidate] = portraitsFuzzy.search(name);

	if (!candidate) {
		await message.channel.send('Portrait not found!');

		return {
			status_code: cmdResult.ENTITY_NOT_FOUND,
		};
	}

	const portraits = followPath(candidate.path);

	if (!portraits || !portraits.length) {
		await message.channel.send('Portrait not found!');

		return {
			status_code: cmdResult.SUBENTITY_NOT_FOUND,
		};
	}

	const embed = new PortraitsListEmbed(message, portraits);

	await embed.send();

	return {
		status_code: cmdResult.SUCCESS,
		arguments: JSON.stringify({ name }),
	};
};

exports.run = ({ message, args }) => (
	!args.length
		? instructions(message)
		: command(message, args)
);

exports.category = categories.DB;
