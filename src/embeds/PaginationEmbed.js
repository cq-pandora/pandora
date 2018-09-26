const { Message } = require('discord.js');
const { Embeds: EmbedsMode } = require('discord-paginationembed');

class PaginationEmbed extends EmbedsMode {
	constructor(initialMessage, doNotPaginate = false) {
		if (initialMessage && !(initialMessage instanceof Message)) {
			throw new Error('Initial message should be Discord.js Message object or null');
		}

		super({
			navigationEmojis: {
				back: '◀',
				jump: '🅱',
				forward: '▶',
				delete: '🤔'
			}
		});

		this.doNotPaginate = doNotPaginate;
		this.setDisabledNavigationEmojis(['JUMP', 'DELETE']);
		this.addFunctionEmoji('🗑', (_, self) => {
			self.clientMessage.message.delete();
			if (initialMessage) initialMessage.delete();
		});

		if (initialMessage) {
			this.setAuthorizedUsers([initialMessage.author.id]);
			this.setChannel(initialMessage.channel);
		}
	}

	setArray(arr) {
		if (arr.length > 1 && !this.doNotPaginate) {
			return super.setArray(arr.map((e, idx) => e.setFooter(`Page ${idx + 1}/${arr.length}`)));
		}

		return super.setArray(arr);
	}

	send() {
		return this.build();
	}
}

module.exports = PaginationEmbed;
