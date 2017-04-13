const getFoldingFanPos = function (){
	let start = {
		x: 60,
		y: 150
	}
	let rotations = [-30, -10, 10, 30];
	let width = 50;
	let height = 50;
	let gutter = 20;

	let charPos = [
		{
			startPosX: start.x, 
			startPosY:  start.y, 
			rotation: rotations[0] * Math.PI / 180,
			charBoxWidth: width
		},
		{
			startPosX: start.x + width + gutter, 
			startPosY: start.y - gutter, 
			rotation: rotations[1] * Math.PI / 180,
			charBoxWidth: width
		},
		{
			startPosX: start.x + (width + gutter) * 2, 
			startPosY: start.y - gutter, 
			rotation: rotations[2] * Math.PI / 180,
			charBoxWidth: width
		},
		{
			startPosX: start.x + (width + gutter) * 3, 
			startPosY: start.y, 
			rotation: rotations[3] * Math.PI / 180,
			charBoxWidth: width
		},
	];
	return charPos;
}

export default getFoldingFanPos;