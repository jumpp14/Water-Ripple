var canvas  = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var cols;
var rows;

var current = [];
var previous = [];

var damping = 0.99;

var ifMouseDown = false;

var ifStarted = false;

function make2DArray(arr, cols, rows){
	for(var i = 0; i < rows; i++){
		arr.push([]);
		for(var j = 0; j < cols * 4; j++){
			if(j % 4 == 3){
				arr[i][j] = 255;
			}
			else {
				arr[i][j] = 0;
			}
		}
	}
	return arr;
}


function init(){
	cols = canvas.width;
	rows = canvas.height;
	current = make2DArray(current, cols, rows);
	previous = make2DArray(previous, cols, rows);
	ifStarted = false;
	window.requestAnimationFrame(draw);
}


function draw(){
	ctx.fillStyle = "black";  
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	var data = imageData.data;

	if(ifStarted == true){
		for(var i = 1; i < (rows - 1); i++){
			for(var j = 4; j < (cols - 1) * 4; j++){
				if(j % 4 == 3){
					if(current[i][j] != 255){
						current[i][j] = (previous[i-1][j] + previous[i+1][j] + previous[i][j-4] + previous[i][j+4]) / 2 - current[i][j];
	        			current[i][j] = current[i][j] * damping;
	          	
	          			var index = j + i * cols * 4;
	        			data[index] = current[i][j];
					}
				}
				else {
					current[i][j] = (previous[i-1][j] + previous[i+1][j] + previous[i][j-4] + previous[i][j+4]) / 2 - current[i][j];
	        		current[i][j] = current[i][j] * damping;
	          	
	          		var index = j + i * cols * 4;
	        		data[index] = current[i][j];
	        	} 
			}
		}
	}


	ctx.putImageData(imageData, 0, 0);

	var temp = previous;
	previous = current;
	current = temp;

	window.requestAnimationFrame(draw);

}


init();

$(document).ready(function(){
	$('#canvas').click(function(){
		ifStarted = true;
		var mouseX = event.pageX - canvas.offsetLeft;
		var mouseY = event.pageY - canvas.offsetTop;
		previous[mouseY][mouseX*4] = 159;
		previous[mouseY][mouseX*4+1] = 250;
		previous[mouseY][mouseX*4+2] = 255;
		previous[mouseY][mouseX*4+3] = 255;

	});
});

canvas.addEventListener("mousedown", function(){
	ifMouseDown = true;
	ifStarted = true;
});

var change = 1
var times = 1
canvas.addEventListener("mousemove", function(event){
	if(ifMouseDown == true){
		times += 1
		var mouseX = event.pageX - canvas.offsetLeft;
		var mouseY = event.pageY - canvas.offsetTop;
		randomeColorGenerator(color);
		previous[mouseY][mouseX*4] = color.r;
		previous[mouseY][mouseX*4+1] = color.g;
		previous[mouseY][mouseX*4+2] = color.b;
		previous[mouseY][mouseX*4+3] = 255;
	}
});

canvas.addEventListener("mouseup", function(){
	ifMouseDown = false;
});


var color = {
	r: 84,
	g: 192,
	b: 255,
};

var offset = 20;

function randomeColorGenerator(color){
	var value = (color.r + color.g + color.b)/3;
	var newValue =  value + 2*Math.random() * offset - offset;
	var valueRatio = newValue / value;

	color.r = color.r * valueRatio;
	color.g = color.g * valueRatio;
	color.b = color.b * valueRatio;

	// var red = Math.floor(Math.random() * 0) + 1
	// var green = Math.floor(Math.random() * 0) + 1    
	// var blue = Math.floor(Math.random() * 255) + 1    

	// if(color != null){
	// 	red = (red + color.r);
	// 	green = (green + color.g);
	// 	blue = (blue + color.b);
	// }

	// color.r = red;
	// color.g = green;
	// color.b = blue;
	console.log(color);
	return color;
}
