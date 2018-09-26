module.exports = (messageText) => {
	const res = [];
	const regexes = {
		user: /<@!?(\d+)>/gm,
		channel: /<#(\d+)>/gm,
		role: /<@&(\d+)>/gm,
		emoji: /<a?:.*:(\d+)>/gm,
	};

	for (const mentionType of Object.keys(regexes)) {
		let match;

		// eslint-disable-next-line no-cond-assign
		while (match = regexes[mentionType].exec(messageText)) {
			res.push({
				type: mentionType,
				id: match[1],
				text: match[0],
			});
		}
	}

	return res;
};
