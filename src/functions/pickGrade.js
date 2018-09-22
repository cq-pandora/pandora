module.exports = () => {
    const roll = Math.random();

    if (roll >= 0 && roll <= 0.81) {
        return '3';
    } else if (roll > 0.81 && roll <= 0.81 + 0.149) {
        return '4';
    } else if (roll > 0.81 + 0.149 && roll <= 0.81 + 0.149 + 0.035) {
        return '5';
    }

    return '6';
};
