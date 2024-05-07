# photocylinder.js: Projected Cylindrical Image

// TODO: update with the more developed version from the sydneyhikingtrip app

Displays a cylindrical projection of a panoramic image.

## Example

https://woollymittens.github.io/photo-cylinder/

## How to include the script

The stylesheet is best included in the header of the document.

```html
<link rel="stylesheet" href="css/photocylinder.css"/>
```

This include can be added to the header or placed inline before the script is invoked.

```html
<script src="js/photocylinder.js"></script>
```

Or use [Require.js](https://requirejs.org/).

```js
requirejs([
	'js/photocylinder.js'
], function(Photocylinder) {
	...
});
```

Or use imported as a component in existing projects.

```js
@import {Photocylinder} from "js/photocylinder.js";
```

## How to start the script

```javascript
var photoCylinder = new Photocylinder({
	'url': './img/p4080071_fov90.jpg',
	'element' : document.querySelector('#photocylinder a'),
	'elements' : document.querySelectorAll('#photocylinder a'),
	'container' : document.body,
	'standalone': true,
	'spherical' : /r(\d+).jpg/i,
	'slicer' : 'php/imageslice.php?src={src}&{size}',
	'idle': 0.002,
	'success': function(e) { console.log('success', e); },
	'failure': function(e) { console.log('failure', e); }
});
```

**'url' : {string}** - Either load this url immediately.

- **'element' : {dom element}** - *Or* when clicked on a single target element.

- **'elements' : {array}** - *Or* when clicked on any of multiple target elements.

**'container' : {dom element}** - Restrict the popup to this container.

**'standalone': {boolean}** - Don't use the modal popup interface.

**'spherical' : {regexp}** - File name check for spherical projections.

**'slicer' : {string}** - Web-service for resizing images. An example is provided as *./php/imageslice.php*.

**idle : {float}** - Steps in degrees to rotate when idle.

**success : {function}** - Function that gets called when the image is loaded and displayed successfully.

**failure : {function}** - Function that gets called when the image fails to load or display.

## License

This work is licensed under a [MIT License](https://opensource.org/licenses/MIT). The latest version of this and other scripts by the same author can be found on [Github](https://github.com/WoollyMittens).
