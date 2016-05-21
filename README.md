# riptide

Create a ripple effect with blocks on a multi-canvas setup using javascript. Riptide uses a 3 layer canvas setup to do the animations. These 3 layers can be individually configured for your desired effect.

## Usage

#### HTML
An empty container `div` will have to be created that will be used for each canvas to be generated inside:
```html
<div id="container"></div>
```
In order to use a full screen canvas, the container will need a specified height and width:
```html
<div id="container" style="height: 1000px; width: 1000px"></div>
```

#### Javascript
To initiate riptide on your container, add the following to your javascript:
```javascript
$('#container').riptide({
	option1: 1,
	option2: 2
});
```

#### Then what
The javascript will then create the 3 canvasses that will be used. The grid, ripple, and blocks:
```html
<div id="container">
	<canvas id="grid" width="300" height="300" style="border: 1px solid rgb(211, 211, 211); position: absolute; z-index: 1;"></canvas>
	<canvas id="ripple" width="300" height="300" style="border: 1px solid rgb(211, 211, 211); position: absolute; z-index: 2;"></canvas>
	<canvas id="blocks" width="300" height="300" style="border: 1px solid rgb(211, 211, 211); position: absolute; z-index: 3;"></canvas>
</div>
```
Grid is used as a background and to store the blocks that will be used in the effect.

Ripple is an invisible (by default) circle that increases in size as time passes.

Blocks is the layer that changes the color of the blocks based on the position of the circle.


## Options

Option | Type | Default | Description
------ | ---- | ------- | -----------
canvasLayoutClasses | object | See below | Set the class names for the 3 canvas layers
canvasFullSize | boolean | false | Whether to use the specified canvas size or max to the container
canvasWidth | int | 300 | Sets a specific canvas width
canvasHeight | int | 300 | Sets a specific canvas height
canvasStyle | string | `'border:1px solid #D3D3D3;'` | Sets a style on the grid canvas
gridStrokeStyle | string | '#D3D3D3' | Stroke style for the grid
gridLineWidth | int | 1 | Line width for the grid
blockWidth | int | 10 | Sets the ripple block width
blockHeight | int | 10 | Sets the ripple block height
blockFillStyle | string | '#578c22' | Fill style for the ripple blocks
blockStrokeStyle | string | '#578c22' | Stroke style for the ripple blocks
blockLineWidth | int | 1 | Line width for the ripple blocks. Defaults to `gridLineWidth` if not set
blockType | string | 'fill' | Style of the ripple blocks. Can be set to `fill` or `stroke`
blockExcludeGridLines | boolean | true | If set to false, the ripple blocks will overlap the grid lines
blockProbability | int | 90 | Probablitlity that a ripple block's color change will triggered
rippleStyle | string | 'rgba(0,0,0,0.0)' | Set the style of the ripple (invisible by default)
rippleSpeed | int | 1 | The speed at which the ripple increases in size
tasteTheRainbow | boolean | false | Only if you like unicorns!

### Custom canvasLayoutClasses
```javascript
canvasLayoutClasses: {
	grid: 'grid',
	ripple: 'ripple',
	blocks: 'blocks'
}
```

## Examples
Examples of how to use riptide can be seen in `/example`. This directory contains a basic implementation of the riptide plugin.

## Dependencies
jQuery >= 1.7

#### ToDo
Fix ripple just "jumping" back to start. It should either be able to alternate between colors, or retract