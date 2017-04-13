const getPoetryPos = function (){
	let start = {
		x: 25,
		y: 75
	}
	let width = 36;
	let height = 36;
	let gutter = 4;

	let charPos = [
		{x: start.x, y:  start.y},
		{x: start.x + width, y: start.y},
		{x: start.x + width * 2, y: start.y},
		{x: start.x + width * 3, y: start.y},
		{x: start.x + width * 4, y: start.y},
		{x: start.x + width * 5, y: start.y},
		{x: start.x + width * 6, y: start.y},

		{x: start.x, y: start.y + gutter + height},
		{x: start.x + width, y: start.y + gutter + height},
		{x: start.x + width * 2, y: start.y + gutter + height},
		{x: start.x + width * 3, y: start.y + gutter + height},
		{x: start.x + width * 4, y: start.y + gutter + height},
		{x: start.x + width * 5, y: start.y + gutter + height},
		{x: start.x + width * 6, y: start.y + gutter + height},

		{x: start.x, y: start.y + (gutter + height) * 2},
		{x: start.x + width, y: start.y + (gutter + height) * 2},
		{x: start.x + width * 2, y: start.y + (gutter + height) * 2},
		{x: start.x + width * 3, y: start.y + (gutter + height) * 2},
		{x: start.x + width * 4, y: start.y + (gutter + height) * 2},
		{x: start.x + width * 5, y: start.y + (gutter + height) * 2},
		{x: start.x + width * 6, y: start.y + (gutter + height) * 2},

		{x: start.x, y: start.y + (gutter + height) * 3},
		{x: start.x + width, y: start.y + (gutter + height) * 3},
		{x: start.x + width * 2, y: start.y + (gutter + height) * 3},
		{x: start.x + width * 3, y: start.y + (gutter + height) * 3},
		{x: start.x + width * 4, y: start.y + (gutter + height) * 3},
		{x: start.x + width * 5, y: start.y + (gutter + height) * 3},
		{x: start.x + width * 6, y: start.y + (gutter + height) * 3},
	];
	return charPos;
}

export default getPoetryPos;