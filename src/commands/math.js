const math = require('mathjs');

const { getPrefix } = require('../functions');
const {
	categories,
	cmdResult,
} = require('../util');

const instructions = async (message) => {
	const prefix = getPrefix(message);

	await message.channel.send({
		title: `${prefix}math [<expression>]`,
		footer: {
			text: 'Visit http://mathjs.org/ for examples.'
		},
		fields: [
			{
				name: '<expression>',
				value: `Resolve <expression>.\n*e.g. ${prefix}math 2 + 2*`
			}
		]
	});

	return {
		status_code: cmdResult.NOT_ENOUGH_ARGS,
	};
};

const command = async (message, args) => {
	const problem = args.join(' ');

	let err = false;
	let result = null;
	try {
		result = math.eval(problem).toString();
	} catch (error) {
		result = error.toString();
		err = true;
	}

	await message.channel.send({
		embed: {
			description: result
		},
	});

	return {
		status_code: err
			? cmdResult.UNKNOWN_ERROR
			: cmdResult.SUCCESS,
		target: 'math',
		arguments: JSON.stringify({ problem }),
	};
};

exports.run = ({ message, args }) => (
	!args.length
		? instructions(message)
		: command(message, args)
);

exports.category = categories.MISC;
