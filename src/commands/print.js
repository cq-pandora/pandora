const { getPrefix } = require('../functions');
const {
	categories,
	cmdResult,
} = require('../util');

const instructions = async (message) => {
	const prefix = getPrefix(message);

	const embed = {
		title: `${prefix}print [<text>]`,
		fields: [
			{
				name: '<text>',
				value: `Print <text> anonymously.\n*e.g. ${prefix}print hello world*`
			}
		]
	};

	await message.channel.send({ embed });

	return {
		status_code: cmdResult.NOT_ENOUGH_ARGS,
	};
};

const command = async (message, args) => {
	await message.delete();

	const text = args.join(' ');

	await message.channel.send({
		embed: {
			description: text
		}
	});
};

exports.run = ({ message, args }) => (
	!args.length
		? instructions(message)
		: command(message, args)
);

exports.category = categories.MISC;
