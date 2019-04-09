const { js_beautify: beautify } = require('js-beautify');

const { inspect } = require('util');
const { Script, createContext } = require('vm');

const { categories, cmdResult } = require('../util');

exports.run = async ({ message, args }) => {
	let input = args.join(' ');

	input = beautify(input, {
		indent_size: 2
	});

	let output;
	let err = false;

	try {
		const sandbox = new Script(input);
		const context = createContext(
			{},
			{
				name: 'Eval',
				codeGeneration: {
					strings: false,
					wasm: false
				}
			}
		);

		output = await sandbox.runInContext(context);
		output = inspect(output, {
			colors: false,
			compact: false,
			maxArrayLength: 30
		});
	} catch (error) {
		err = true;

		output = String(error);
	}

	await message.channel.send({
		embed: {
			fields: [
				{
					name: 'Input',
					value: `\`\`\`js\n${input}\`\`\``
				},
				{
					name: 'Output',
					value: `\`\`\`js\n${output}\`\`\``
				}
			]
		}
	});

	return {
		status_code: err
			? cmdResult.UNKNOWN_ERROR
			: cmdResult.SUCCESS,
		target: 'script',
		arguments: JSON.stringify({ input: args.join(' ') }),
	};
};

exports.protected = true;

exports.category = categories.PROTECTED;
