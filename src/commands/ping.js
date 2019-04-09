const { categories, cmdResult } = require('../util');

exports.run = async ({ message, args }) => {
	const newMessage = await message.channel.send({
		embed: {
			description: 'Pinging...'
		}
	});

	await newMessage.edit({
		embed: {
			title: 'Pong! 🏓',
			description: `${newMessage.createdTimestamp - message.createdTimestamp} ms`
		}
	});

	return {
		status_code: cmdResult.SUCCESS,
		target: 'ping',
	};
};

exports.category = categories.BOT;
