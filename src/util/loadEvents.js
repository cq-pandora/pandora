const requireEvent = event => require(`../events/${event}`);

module.exports = (client) => {
	client.on('message', requireEvent('message')(client));
	client.on('reconnecting', requireEvent('reconnecting'));
	process.on('unhandledRejection', error => requireEvent('unhandledRejection')(error));
};
