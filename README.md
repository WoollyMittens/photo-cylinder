# useful.photocylinder.js: Projected Cylindrical Image

Displays a cylindrical projection of a panoramic image.

Try the <a href="http://www.woollymittens.nl/default.php?url=useful-photocylinder">demo</a>.

## How to include the script

The stylesheet is best included in the header of the document.

```html
<link rel="stylesheet" href="./css/useful-photocylinder.css"/>
```

This include can be added to the header or placed inline before the script is invoked.

```html
<script src="./js/useful-photocylinder.js"></script>
```

## How to start the script

```javascript
var photoCylinder = new useful.photocylinder().init({
	// target elements
	'elements': document.querySelectorAll('#photocylinder a'),
	// restrict the popup to a container
	'container' : document.body,
	// don't use the built in modal popup
	'standalone': true,
	// file name check for spherical projections
	'spherical' : /fov360/,
	// file name check for cylindrical projections
	'cylindrical' : /fov180/,
	// optional webservice for acquiring sized images
	'slicer' : 'php/imageslice.php?src=../{src}&{size}',
	// rotation speed when idle
	'idle': 0.002,
	// event handlers for image loading
	'success': function(e) { console.log('success', e); },
	'failure': function(e) { console.log('failure', e); }
});
```

**'elements' : {array}** - A collection of target elements.

**'container' : {element}** - Restrict the popup to a container.

**'standalone': {boolean}** - Don't use the built in modal popup interface.

**'spherical' : {regexp}** - File name check for spherical projections.

**'cylindrical' : {regexp}** - File name check for cylindrical projections.

**'slicer' : {string}** - Optional web-service for resizing images. An example is provided as *./php/imageslice.php*.

**idle : {float}** - The steps in degrees to rotate when idle.

**success : {function}** - A function that gets called when the image is loaded and displayed successfully.

**failure : {function}** - A function that gets called when the image fails to load or display.

## How to build the script

This project uses node.js from http://nodejs.org/

This project uses gulp.js from http://gulpjs.com/

The following commands are available for development:
+ `npm install` - Installs the prerequisites.
+ `gulp import` - Re-imports libraries from supporting projects to `./src/libs/` if available under the same folder tree.
+ `gulp dev` - Builds the project for development purposes.
+ `gulp dist` - Builds the project for deployment purposes.
+ `gulp watch` - Continuously recompiles updated files during development sessions.
+ `gulp serve` - Serves the project on a temporary web server at http://localhost:8500/.
+ `gulp php` - Serves the project on a temporary php server at http://localhost:8500/.

## License

This work is licensed under a Creative Commons Attribution 3.0 Unported License. The latest version of this and other scripts by the same author can be found at http://www.woollymittens.nl/
