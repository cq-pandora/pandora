module.exports = error => {
    // Ignore discord api errors related to embed
    if (error && error.name === 'DiscordAPIError' && (error.message === 'Unknown Message' || error.message === 'Missing Permissions')) return;
    console.log(error);
};
