const { createLogger, format, transports } = require('winston');

const formatError = error => `\n${error.stack}`;
const formatPlainExtra = extra => JSON.stringify(extra, null, 4);
const formatExtra = extra => (extra instanceof Error ? formatError(extra) : formatPlainExtra(extra));

const loggingFormat = format.printf((info) => {
	const { timestamp, label, level, message, ...extra } = info;

	const splat = extra[Symbol.for('splat')] || [];

	return `${timestamp} [${label}:${level}] ${message} ${splat.map(s => formatExtra(s)).join('\n')}`;
});

function makeLogger(label) {
	return createLogger({
		format: format.combine(
			format.colorize(),
			format.align(),
			format.label({ label }),
			format.timestamp(),
			loggingFormat,
		),
		transports: [new transports.Console()],
		level: 'debug',
	});
}

module.exports = makeLogger('GENERAL');
module.exports.db = makeLogger('DB');
module.exports.commands = makeLogger('CMD');
