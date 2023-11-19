var tools = new Object();


tools.get_sort_by = function(points){
	var sumx = 0;
	var sumy = 0;

	console.log("요청순서");
	console.log(points);
	points.forEach((point) => {
	sumx += point[0];
	sumy += point[1];
	});

	var centerx = sumx / points.length;
	var centery = sumy / points.length;

	var result = [];

	points.forEach((point) => {
		var radian = Math.atan2(centerx - point[0], centery - point[1]);
		var angle = radian * (180 / Math.PI);
		result.push([angle, point[0], point[1]]);
	});

	result.sort((a, b) => a[0] - b[0]);
	console.log("정렬");
	console.log(result);
	
	return result;
		
}