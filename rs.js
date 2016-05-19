;(function(window, $) {

	var Rs = function(element, options){
			this.element  = element;
			this.$element = $(element);
			this.options  = options;
			self = this;
		};

	// Plugin defaults
	Rs.prototype.defaults = {
		test: 'test'
	};

	Rs.prototype.init = function() {
		// Extend default with user options
		self.config = $.extend(true, {}, self.defaults, self.options);
		self.alertt();
	};

	// Test alert method
	// Rs.prototype.alertt = function() {
	// 	alert(self.config.test);
	// };

	$.fn.rs = function(options) {
		return this.each(function() {
			new Rs(this, options).init();
		});
	};

	window.Rs = Rs;

})(window, jQuery);

// // Setting canvas and context variables that will be used
// var canvasGrid = document.getElementById('grid');
// var canvasRipple = document.getElementById('ripple');
// var canvasBlocks = document.getElementById('blocks');
// var contextGrid = canvasGrid.getContext("2d");
// var contextRipple = canvasRipple.getContext('2d');
// var contextBlocks = canvasBlocks.getContext('2d');

// // Canvas Width and Height
// var canvasWidth = canvasGrid.width;
// var canvasHeight = canvasGrid.height;

// // Grid array that will store all the grid positions
// var grid = [];

// // Defaults
// var radius = 0;
// var rectanglePosX = 0;
// var rectanglePosY = 0;
// var ripplePosX = 0;
// var ripplePosY = 0;
// var requestAnimationFrame = window.requestAnimationFrame || 
//                             window.mozRequestAnimationFrame || 
//                             window.webkitRequestAnimationFrame || 
//                             window.msRequestAnimationFrame;

// function drawGrid() {
// 	var complete = false;

// 	contextGrid.strokeStyle="#EEEEEE";
// 	contextGrid.strokeRect(rectanglePosX,rectanglePosY,20,20);

// 	// Populate the grid array
// 	grid.push({
// 		x: rectanglePosX,
// 		y: rectanglePosY,
// 		w: 20,
// 		h: 20
// 	});

// 	rectanglePosX = rectanglePosX + 20;
// 	if (rectanglePosX > canvasWidth) {
// 		if (rectanglePosY > canvasHeight) {
// 			complete = true;

// 			// Start drawing the ripples
// 			calcRipplePos();
// 			drawRipple();
// 		}
// 		rectanglePosX = 0;
// 		rectanglePosY = rectanglePosY + 20;
// 	}

// 	if (!complete) {
// 		requestAnimationFrame(drawGrid);
// 	}
// }

// /**
//  * Calculates a random position for the circle to the sides of tha canvas
//  * 
//  * @return {void}
//  */
// function calcRipplePos() {
// 	if (Math.random() > 0.5) {
// 		ripplePosX = canvasWidth - (canvasWidth * Math.random())/3;
// 		ripplePosY = canvasHeight - (canvasHeight * Math.random());
// 	} else {
// 		ripplePosX = 0 + (canvasWidth * Math.random())/3;
// 		ripplePosY = 0 + (canvasHeight * Math.random());
// 	}
// }

// /**
//  * Repeatedly draws a circle with an increased radius on every iteration.
//  * Circle has a random new location everytime the radius surpasses the canvas size
//  * 
//  * @return {void}
//  */
// function drawRipple() {
//     contextRipple.clearRect(0, 0, canvasWidth, canvasHeight);
     
//     // draw the Ripple
//     contextRipple.beginPath();

//     contextRipple.arc(ripplePosX, ripplePosY, radius, 0, Math.PI * 2, false);
//     contextRipple.closePath();

//     // Making the ripple invisible before we stroke
//     contextRipple.strokeStyle = "rgba(0,0,0,0.0)";
     
//     // draw the Ripple
//     contextRipple.stroke();

//     // Run the collisions check
// 	collisionCheck();

//     radius += 1;

//     if (radius > canvasWidth || radius > canvasHeight) {
//     	radius = 0;
//     	calcRipplePos();
//     	contextBlocks.clearRect(0,0,canvasWidth,canvasHeight);
//     }

//     requestAnimationFrame(drawRipple);
// }


// /**
//  * Detect collision between grid blocks and ripple
//  * Iterates through grid array to compare all the block objects
//  * This should be called on every iteration of the ripple
//  * 
//  * @param  {object} rectangle with x,y,w,z
//  * @return {void}
//  */
// function collisionCheck() {
// 	$.each(grid, function(key, rect) {
// 		var rcx = Math.pow(Math.floor(rect.x) - Math.floor(ripplePosX),2);
// 		var rcy = Math.pow(Math.floor(rect.y) - Math.floor(ripplePosY),2);
// 		var dist = Math.sqrt(rcx + rcy);

// 		if (radius > dist && Math.random() > 0.8) {
// 			contextBlocks.fillStyle = "#D3D3D3";
// 			contextBlocks.fillRect(rect.x,rect.y,rect.w,rect.h);
// 		}
// 	});
// }

// drawGrid();