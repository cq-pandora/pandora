module.exports = (start, end) => (new Array(end - start + 1)).fill(0).map((_, i) => i + start);
