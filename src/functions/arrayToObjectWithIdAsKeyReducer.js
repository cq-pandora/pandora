module.exports = (res, v) => {
	res[v.id] = v;

	return res;
};
