# photocylinder.js: Projected Cylindrical Image

Displays a cylindrical projection of a panoramic image.

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

Or import into an MVC framework.

```js
var Photocylinder = require('js/photocylinder.js');
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

This work is licensed under a [MIT License](https://opensource.org/licenses/MIT). The latest version of this and other scripts by the same author can be found on [Github](https://github.com/WoollyMittens) and at [WoollyMittens.nl](https://www.woollymittens.nl/).
