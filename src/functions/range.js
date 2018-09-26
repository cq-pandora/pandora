module.exports = (start, end) => (
	Array(end - start + 1).fill().map((_, i) => i + start)
);
