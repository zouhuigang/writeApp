const Point = function(x, y, time, index) {
	this.x = x;
	this.y = y;
	this.time = time;
	this.index = index;
}

Point.prototype.velocityFrom = function(startPoint){
	return (this.time !== startPoint.time) ? this.distanceTo(startPoint) / (this.time - startPoint.time) : 1;
}

Point.prototype.distanceTo = function(startPoint) {
	return Math.sqrt(Math.pow(this.x - startPoint.x, 2) + Math.pow(this.y - startPoint.y, 2));
}

export default Point;

