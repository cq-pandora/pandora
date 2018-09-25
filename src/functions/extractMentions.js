module.exports = (messageText) => {
    const res = [];
    const regexes = {
        user: /<@!?(\d+)>/gm,
        channel: /<#(\d+)>/gm,
        role: /<@&(\d+)>/gm,
        emoji: /<a?:.*:(\d+)>/gm,
    };

    for (const mentionType in regexes) {
        let match;

        while (match = regexes[mentionType].exec(messageText)) {
            res.push({
                type: mentionType,
                id: match[1],
                text: match[0],
            })
        }
    }

    return res;
};
