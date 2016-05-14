// Setting canvas and context variables that will be used
var canvasGrid = document.getElementById('grid');
var canvasRipple = document.getElementById('ripple');
var canvasBlocks = document.getElementById('blocks');
var contextGrid = canvasGrid.getContext("2d");
var contextRipple = canvasRipple.getContext('2d');
var contextBlocks = canvasBlocks.getContext('2d');
// Canvas Width and Height
var canvasWidth = canvasGrid.width;
var canvasHeight = canvasGrid.height;
// Grid array that will store all the grid positions
var grid = [];
// Defaults
var radius = 0;
var rectanglePosX = 0;
var rectanglePosY = 0;
var requestAnimationFrame = window.requestAnimationFrame || 
                            window.mozRequestAnimationFrame || 
                            window.webkitRequestAnimationFrame || 
                            window.msRequestAnimationFrame;

function drawGrid() {
	var complete = false;

	contextGrid.strokeStyle="#EEEEEE";
	contextGrid.strokeRect(rectanglePosX,rectanglePosY,20,20);

	// Populate the grid array
	grid.push({
		x: rectanglePosX,
		y: rectanglePosY,
		w: 20,
		h: 20
	});

	rectanglePosX = rectanglePosX + 20;
	if (rectanglePosX > canvasWidth) {
		if (rectanglePosY > canvasHeight) {
			complete = true;
			drawRipple();
		}
		rectanglePosX = 0;
		rectanglePosY = rectanglePosY + 20;
	}

	if (!complete) {
		requestAnimationFrame(drawGrid);
	}
}

function drawRipple() {
    contextRipple.clearRect(0, 0, canvasWidth, canvasHeight);
     
    // draw the Ripple
    contextRipple.beginPath();
     
    // var radius = 25 + 150 * Math.abs(Math.cos(angle));
    contextRipple.arc(225, 225, radius, 0, Math.PI * 2, false);
    contextRipple.closePath();

    // Making the ripple invisible before we stroke
    contextRipple.strokeStyle = "rgba(0,0,0,0.0)";
     
    // draw the Ripple
    contextRipple.stroke();

    // Run the collisions check
    $.each(grid, function(key, rect) {
    	collisionCheck(rect);
    });

    radius += 1;

    if (radius > canvasWidth || radius > canvasHeight) {
    	radius = 0;
    	contextBlocks.clearRect(0,0,canvasWidth,canvasHeight);
    }

    requestAnimationFrame(drawRipple);
}

function collisionCheck(rect) {
	// Need to add dynamic circle position here for X and Y 
	var rcx = Math.pow(Math.floor(rect.x) - Math.floor(225),2);
	var rcy = Math.pow(Math.floor(rect.y) - Math.floor(225),2);
	var dist = Math.sqrt(rcx + rcy);

	//  && circle.r - dist < 100
	if (radius > dist && Math.random() > 0.8) {
		contextBlocks.fillStyle = "#D3D3D3";
		contextBlocks.fillRect(rect.x,rect.y,rect.w,rect.h);
	}
}

drawGrid();