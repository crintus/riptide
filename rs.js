var canvas = document.getElementById('myCanvas');
var c = canvas.getContext("2d");
var rectangles = [];
var animation;
var circle = {
	x: Math.random() * canvas.width,
	y: Math.random() * canvas.height,
	r: 1
};
var genRect = {
	x: 0,
	y: 0,
	w: 50,
	h: 50
};

var rectDraw = setInterval(function() {
	c.strokeRect(genRect.x,genRect.y,genRect.w,genRect.h);
	// Pushing rectangle object to array
	rectangles.push({
		x: genRect.x,
		y: genRect.y,
		w: genRect.w,
		h: genRect.h
	});
	genRect.x = genRect.x + 50;
	if (genRect.x > canvas.width) {
		if (genRect.y > canvas.height) {
			clearInterval(rectDraw);
			setInterval(ripple, 100);
		}
		genRect.x = 0;
		genRect.y = genRect.y + 50;
	}

	// c.save();

}, 1);

function ripple() {
	if (circle.r > canvas.width + 400) {
		clearInterval(animation);
		circle = {
			x: Math.random() * canvas.width,
			y: Math.random() * canvas.height,
			r: 1
		}
		c.clearRect(0,0,canvas.width,canvas.height);
		// c.restore();
	}
	draw(circle.x, circle.y, circle.r);
	$.each(rectangles, function(key, rect) {
		collisionCheck(rect, circle);
	});


	// c.clearRect(0,rect.y,rect.w,rect.h);
	// c.strokeRect(rect.x,rect.y,rect.w,rect.h);
};

function collisionCheck(rect, circle) {
	var rcx = Math.pow(Math.floor(rect.x) - Math.floor(circle.x),2);
	var rcy = Math.pow(Math.floor(rect.y) - Math.floor(circle.y),2);
	var dist = Math.sqrt(rcx + rcy);

	//  && circle.r - dist < 100
	if (circle.r > dist && Math.random() > 0.8) {
		c.fillStyle = "#D3D3D3";
		c.fillRect(rect.x,rect.y,rect.w,rect.h);
	}
}

function draw(x, y, r) {
	// c.globalAlpha = 0;
	c.beginPath();
	c.arc(x,y,r,0,2*Math.PI);
	c.stroke();

	circle.r = r + 20;
}