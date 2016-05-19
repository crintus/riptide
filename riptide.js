;(function(window, $) {

	var Riptide = function(element, options){
			this.element  = element;
			this.$element = $(element);
			this.options  = options;

			this.context = {
				grid: '',
				ripple: '',
				blocks: ''
			};

			// Grid array that will store all the grid positions
			this.grid = [];

			this.radius = 0;
			this.rectanglePosX = 0;
			this.rectanglePosY = 0;
			this.ripplePosX = 0;
			this.ripplePosY = 0;
			this.requestAnimationFrame = window.requestAnimationFrame || 
			                            window.mozRequestAnimationFrame || 
			                            window.webkitRequestAnimationFrame || 
			                            window.msRequestAnimationFrame;

			self = this;
		};

	// Plugin defaults
	Riptide.prototype.defaults = {
		layoutClasses: {
			grid: 'grid',
			ripple: 'ripple',
			blocks: 'blocks'
		},
		fullScreen: false,
		width: 300,
		height: 300,
		style: {
			gridColor: '#000',
			canvasStyle: 'border:1px solid #000',
			rippleStyle: 'rgba(0,0,0,0.0)',
			blockFillStyle: '#D3D3D3'
		}
	};

	Riptide.prototype.init = function() {
		// Extend default with user options
		self.config = $.extend(true, {}, self.defaults, self.options);
		self.generateCanvas();
	};

	Riptide.prototype.generateCanvas = function() {
		if (self.config.fullScreen) {
			self.config.width = self.$element.width();
			self.config.height = self.$element.height();
		}
		for (layout in self.config.layoutClasses) {
			$('<canvas id="' + layout + '"></canvas>').attr({
					width: self.config.width,
					height: self.config.height,
					style: self.config.style.canvasStyle
				}).appendTo(this.$element);

			self.context[layout] = document.getElementById(layout).getContext("2d");
		};

		self.drawGrid();
	};

	/**
	 * Iterates the x columns and y rows for the canvas, drawing out all
	 * the grid block and saving them in self.grid
	 *
	 * @return void 
	 * @author Johan du Plessis
	 */
	Riptide.prototype.drawGrid = function() {
		this.complete = false;

		self.context.grid.strokeStyle = self.config.style.gridColor;
		self.context.grid.strokeRect(self.rectanglePosX,self.rectanglePosY,20,20);

		// Populate the grid array
		self.grid.push({
			x: self.rectanglePosX,
			y: self.rectanglePosY,
			w: 20,
			h: 20
		});

		self.rectanglePosX = self.rectanglePosX + 20;
		if (self.rectanglePosX > self.config.width) {
			if (self.rectanglePosY > self.config.width) {
				this.complete = true;

				// Start drawing the ripples
				self.calcRipplePos();
				self.drawRipple();
			}
			self.rectanglePosX = 0;
			self.rectanglePosY = self.rectanglePosY + 20;
		}

		if (!this.complete) {
			requestAnimationFrame(self.drawGrid);
		}
	}

	/**
	 * Calculates a random position for the circle to the sides of the canvas
	 * 
	 * @return void
	 * @author Johan du Plessis
	 */
	Riptide.prototype.calcRipplePos = function() {
		if (Math.random() > 0.5) {
			self.ripplePosX = self.config.width - (self.config.width * Math.random())/3;
			self.ripplePosY = self.config.height - (self.config.height * Math.random());
		} else {
			self.ripplePosX = 0 + (self.config.width * Math.random())/3;
			self.ripplePosY = 0 + (self.config.height * Math.random());
		}
	}

	/**
	 * Repeatedly draws a circle with an increased radius on every iteration.
	 * Circle has a random new location everytime the radius surpasses the canvas size
	 * 
	 * @return void
	 * @author Johan du Plessis
	 */
	Riptide.prototype.drawRipple = function() {
	    self.context.ripple.clearRect(0, 0, self.config.width, self.config.height);
	     
	    // draw the Ripple
	    self.context.ripple.beginPath();

	    self.context.ripple.arc(self.ripplePosX, self.ripplePosY, self.radius, 0, Math.PI * 2, false);
	    self.context.ripple.closePath();

	    // Making the ripple invisible before we stroke
	    self.context.ripple.strokeStyle = self.config.style.rippleStyle;
	     
	    // draw the Ripple
	    self.context.ripple.stroke();

	    // Run the collisions check
		self.collisionCheck();

	    self.radius += 1;

	    if (self.radius > self.config.width || self.radius > self.config.height) {
	    	self.radius = 0;
	    	self.calcRipplePos();
	    	self.context.blocks.clearRect(0,0,self.config.width,self.config.height);
	    }

	    requestAnimationFrame(self.drawRipple);
	}

	/**
	 * Detect collision between grid blocks and ripple
	 * Iterates through grid array to compare all the block objects
	 * This should be called on every iteration of the ripple
	 * 
	 * @param  object rectangle with x,y,w,z
	 * @return void
	 * @author Johan du Plessis
	 */
	Riptide.prototype.collisionCheck = function() {
		$.each(self.grid, function(key, rect) {
			var rcx = Math.pow(Math.floor(rect.x) - Math.floor(self.ripplePosX),2);
			var rcy = Math.pow(Math.floor(rect.y) - Math.floor(self.ripplePosY),2);
			var dist = Math.sqrt(rcx + rcy);

			if (self.radius > dist && Math.random() > 0.8) {
				self.context.blocks.fillStyle = self.config.style.blockFillStyle;
				self.context.blocks.fillRect(rect.x,rect.y,rect.w,rect.h);
			}
		});
	}

	$.fn.riptide = function(options) {
		return this.each(function() {
			new Riptide(this, options).init();
		});
	};

	window.Riptide = Riptide;

})(window, jQuery);