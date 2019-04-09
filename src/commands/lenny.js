const { categories, cmdResult } = require('../util');

exports.run = async ({ message, args }) => {
	const embed = {
		description: '( ͡° ͜ʖ ͡°)'
	};

	await message.channel.send({ embed });

	return {
		status_code: cmdResult.SUCCESS,
		target: 'lenny',
	};
};

exports.category = categories.MISC;
