var canvas  = document.getElementById('canvas');
var canvasContext = canvas.getContext('2d');
var columns;
var rows;
var current = [];
var previous = [];
var damping = 0.99;
var isMouseDown = false;
var isStarted = false;

function make2DArray(array, columns, rows){
	for(var i = 0; i < rows; i++){
		array.push([]);
		for(var j = 0; j < columns * 4; j++){
			if(j % 4 == 3){
				// specifies the color is fully opaque
				array[i][j] = 255;
			}
			else {
				// initialize the array with color black
				array[i][j] = 0;
			}
		}
	}
	return array;
}

function init(){
	columns = canvas.width;
	rows = canvas.height;
	current = make2DArray(current, columns, rows);
	previous = make2DArray(previous, columns, rows);
	isStarted = false;
	window.requestAnimationFrame(draw);
}

function draw(){
	canvasContext.fillStyle = "black";  
	canvasContext.fillRect(0, 0, canvas.width, canvas.height);
	var imageData = canvasContext.getImageData(0, 0, canvas.width, canvas.height);
	var data = imageData.data;

	if(isStarted == true){
		for(var i = 1; i < (rows - 1); i++){
			for(var j = 4; j < (columns - 1) * 4; j++){
				if(j % 4 == 3){
					if(current[i][j] != 255){
						current[i][j] = (previous[i-1][j] + previous[i+1][j] + previous[i][j-4] + previous[i][j+4]) / 2 - current[i][j];
	        			current[i][j] = current[i][j] * damping;
	          			var index = j + i * columns * 4;
	        			data[index] = current[i][j];
					}
				}
				else {
					current[i][j] = (previous[i-1][j] + previous[i+1][j] + previous[i][j-4] + previous[i][j+4]) / 2 - current[i][j];
	        		current[i][j] = current[i][j] * damping;
	          		var index = j + i * columns * 4;
	        		data[index] = current[i][j];
	        	} 
			}
		}
	}
	canvasContext.putImageData(imageData, 0, 0);
	var temp = previous;
	previous = current;
	current = temp;
	window.requestAnimationFrame(draw);
}

init();

$('#canvas').click(function(){
	isStarted = true;
	var mouseX = event.pageX - canvas.offsetLeft;
	var mouseY = event.pageY - canvas.offsetTop;
	previous[mouseY][mouseX*4] = 159;
	previous[mouseY][mouseX*4+1] = 250;
	previous[mouseY][mouseX*4+2] = 255;
	previous[mouseY][mouseX*4+3] = 255;
});

canvas.addEventListener("mousedown", function(){
	isMouseDown = true;
	isStarted = true;
});

canvas.addEventListener("mousemove", function(event){
	if(isMouseDown == true){
		var mouseX = event.pageX - canvas.offsetLeft;
		var mouseY = event.pageY - canvas.offsetTop;
		colorGenerator(color);
		previous[mouseY][mouseX*4] = color.r;
		previous[mouseY][mouseX*4+1] = color.g;
		previous[mouseY][mouseX*4+2] = color.b;
		previous[mouseY][mouseX*4+3] = 255;
	}
});

canvas.addEventListener("mouseup", function(){
	isMouseDown = false;
});

var color = {
	r: 255,
	g: 255,
	b: 255,
};

function colorGenerator(color){
	var red = (150 + Math.floor(Math.random() * 150)) * 5;
	var green = (240 + Math.floor(Math.random() * 150)) * 5; 
	var blue = (250 + Math.floor(Math.random() * 200)) * 5;  
	color.r = red;
	color.g = green;
	color.b = blue;
	return color;
}