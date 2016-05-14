## Ripple Squares

Create a ripple effect with blocks on a multi-canvas setup using javascript.

Ripple squares uses a 3 layer canvas setup to do the animations.

Layer 1: Used for the initial grid generation.
Layer 2: The ripple animation.
Layer 3: The squares that go ontop of the grid



##### ToDo:
- [ ] Rework as a plugin
- [ ] Automatically add canvas to specified DOM element
	- Calculate canvas width based on windows
	- User options should override this
- [ ] Allow for user specified options
- [ ] Optimise initial grid generation

---

###### Notes:
**Optimise initial grid generation**

- Using lines instead of rectangles and then calculating the possible possitions for the squares that will populate the grid array?
- Calculate the number of blocks that will be required before the initial drawing of the grid

