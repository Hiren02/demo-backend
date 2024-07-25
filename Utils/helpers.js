/* 
GENERATE RANDOM NUMBER FROM SPECIFIED RANGE
*/
function generateRandom(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

/* 
CHECK IF OBJECT IS EMPTY
*/
function isEmpty(obj) {
	for (let key in obj) {
		if (obj.hasOwnProperty(key)) return false;
	}
	return true;
}

/* 
CHECK IF TWO ARRAYS ARE EQUAL
*/
function arraysEqual(a, b) {
	if (a === b) return true;
	if (a == null || b == null) return false;
	if (a.length != b.length) return false;

	for (let i = 0; i < a.length; ++i) if (a[i] !== b[i]) return false;

	return true;
}

module.exports = {
	generateRandom,
	isEmpty,
	arraysEqual,
};
