module.exports = (str, l = 1024, c = ' ') => {
	const strs = [];

	while (str.length > l) {
		let pos = str.substring(0, l).lastIndexOf(c);
		pos = pos <= 0 ? l : pos;
		strs.push(str.substring(0, pos));
		let i = str.indexOf(c, pos) + 1;
		if (i < pos || i > pos + l) { i = pos; }
		str = str.substring(i);
	}

	strs.push(str);

	return strs;
};
