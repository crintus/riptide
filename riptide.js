;(function(window, $) {

	var Riptide = function(element, options){
			this.element  = element;
			this.$element = $(element);
			this.options  = options;
			// To dynamically set the context
			this.context = {
				grid: '',
				ripple: '',
				blocks: ''
			};
			// Grid array that will store all the grid positions
			this.grid = [];
			// Some globals
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
		// Canvas options
		canvasLayoutClasses: {
			grid: 'grid',
			ripple: 'ripple',
			blocks: 'blocks'
		},
		canvasFullSize: false,
		canvasWidth: 300,
		canvasHeight: 300,
		canvasStyle: 'border:1px solid #D3D3D3;',
		// Grid options
		gridStrokeStyle: '#D3D3D3',
		gridLineWidth: 1,
		// Block options
		blockWidth: 10,
		blockHeight: 10,
		blockFillStyle: '#578c22',
		blockStrokeStyle: '#578c22',
		blockLineWidth: 1,
		blockType: 'fill', // fill or stroke
		blockExcludeGridLines: true,
		blockProbability: 90,
		// Ripple options
		rippleStyle: 'rgba(0,0,0,0.0)',
		rippleSpeed: 1,
		// Taste the rainbow
		tasteTheRainbow: false
	};

	Riptide.prototype.init = function() {
		// Extend default with user options
		self.config = $.extend(true, {}, self.defaults, self.options);
		self.generateCanvas();
	};

	/**
	 * Creates the needed 3 layer canvas setup and applies the styles
	 * 
	 * @return void
	 * @author Johan du Plessis
	 */
	Riptide.prototype.generateCanvas = function() {
		var count = 1;
		if (self.config.canvasFullSize) {
			self.config.canvasWidth = self.$element.width();
			self.config.canvasHeight = self.$element.height();
		}
		for (layout in self.config.canvasLayoutClasses) {
			$('<canvas id="' + layout + '"></canvas>').attr({
				width: self.config.canvasWidth,
				height: self.config.canvasHeight,
				style: self.config.canvasStyle
			}).css({
				'position': 'absolute',
				'z-index': count++
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

		while (self.rectanglePosY < self.config.canvasHeight) {
			while (self.rectanglePosX < self.config.canvasWidth) {
				self.context.grid.rect(self.rectanglePosX,self.rectanglePosY,self.config.blockWidth,self.config.blockHeight);

				self.grid.push({
					x: self.rectanglePosX,
					y: self.rectanglePosY,
					w: self.config.blockWidth,
					h: self.config.blockHeight,
					active: false
				});
				self.rectanglePosX = self.rectanglePosX + self.config.blockWidth;
			}
			self.rectanglePosX = 0;
			self.rectanglePosY = self.rectanglePosY + self.config.blockHeight;
		};

		self.context.grid.strokeStyle = self.config.gridStrokeStyle;
		self.context.grid.lineWidth = self.config.gridLineWidth;
		self.context.grid.stroke();

		self.calcRipplePos();
		self.drawRipple();
	}

	/**
	 * Calculates a random position for the circle to the sides of the canvas
	 * 
	 * @return void
	 * @author Johan du Plessis
	 */
	Riptide.prototype.calcRipplePos = function() {
		if (Math.random() > 0.5) {
			self.ripplePosX = self.config.canvasWidth - (self.config.canvasWidth * Math.random())/3;
			self.ripplePosY = self.config.canvasHeight - (self.config.canvasHeight * Math.random());
		} else {
			self.ripplePosX = 0 + (self.config.canvasWidth * Math.random())/3;
			self.ripplePosY = 0 + (self.config.canvasHeight * Math.random());
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
	    self.context.ripple.clearRect(0, 0, self.config.canvasWidth, self.config.canvasHeight);
	     
	    self.context.ripple.beginPath();
	    self.context.ripple.arc(self.ripplePosX, self.ripplePosY, self.radius, 0, Math.PI * 2, false);
	    self.context.ripple.closePath();
	    // Making the ripple invisible before we stroke
	    self.context.ripple.strokeStyle = self.config.rippleStyle;
	    // draw the Ripple
	    self.context.ripple.stroke();
	    // Run the collisions check
		self.collisionCheck();

	    self.radius += self.config.rippleSpeed;

	    if (self.radius/1.8 > self.config.canvasWidth || self.radius/1.8 > self.config.canvasHeight) {
	    	self.radius = 0;
	    	self.clearActiveRectangles();
	    	self.calcRipplePos();
	    	self.context.blocks.clearRect(0,0,self.config.canvasWidth,self.config.canvasHeight);
	    }

	    requestAnimationFrame(self.drawRipple);
	}

	/**
	 * Draws the active blocks
	 * Style depends on options
	 *
	 * @param  object rect Rectangle that will be drawn
	 * @return mixed Return when blockType == 'stroke' or blockExcludeGridLines == true
	 * @author Johan du Plessis
	 */
	Riptide.prototype.drawBlock = function(rect) {

		if (self.config.tasteTheRainbow) {
			self.context.blocks.fillStyle = self.tasteTheRainbow();
		} else {
			self.context.blocks.fillStyle = self.config.blockFillStyle;
		}

		if (self.config.blockType == 'stroke') {
			if (self.options.gridLineWidth != undefined && self.options.blocksLineWidth == undefined) {
				self.config.blocksLineWidth = self.options.gridLineWidth;
			}
			self.context.blocks.lineWidth = self.config.blocksLineWidth;
			self.context.blocks.strokeStyle = self.config.blockStrokeStyle;
			self.context.blocks.strokeRect(rect.x,rect.y,rect.w,rect.h);
			return;
		}

		// This will keep the grid visible while filling the blocks
		if (self.config.blockExcludeGridLines) {
			self.context.blocks.fillRect(
					rect.x + self.config.gridLineWidth/2,
					rect.y + self.config.gridLineWidth/2,
					rect.w - self.config.gridLineWidth,
					rect.h - self.config.gridLineWidth
				);
			return;
		}

		// Default fillRect
		self.context.blocks.fillRect(rect.x,rect.y,rect.w,rect.h);
	};

	/**
	 * Taste the rainbow
	 * @return string random color
	 */
	Riptide.prototype.tasteTheRainbow = function() {
		var color = '#';
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		for( var i=0; i < 6; i++ ) {
	        color += possible.charAt(Math.floor(Math.random() * possible.length));
	    }

	    return color;
	};

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
		var rcx, rcy, dist;

		$.each(self.grid, function(key, rect) {
			rcx = Math.pow(Math.floor(rect.x) - Math.floor(self.ripplePosX),2);
			rcy = Math.pow(Math.floor(rect.y) - Math.floor(self.ripplePosY),2);
			dist = Math.sqrt(rcx + rcy);

			if (!rect.active && self.radius > dist && Math.random()*100 > self.config.blockProbability) {
				self.drawBlock(rect);
				self.grid[key].active = true;
			}
		});
	}

	Riptide.prototype.clearActiveRectangles = function() {
		$.each(self.grid, function(key, rect) {
			self.grid[key].active = false;
		});
	};

	$.fn.riptide = function(options) {
		return this.each(function() {
			new Riptide(this, options).init();
		});
	};

	window.Riptide = Riptide;

})(window, jQuery);