# Projected Cylindrical Image

Displays a cylindrical projection of a panoramic image.

## Example

https://woollymittens.github.io/photo-cylinder/

## How to include the script

The includes can be added to the HTML document:

```html
<link href="./css/photo-cylinder.css" rel="stylesheet" />
<script src="./js/photo-cylinder.js" type="module"></script>
```

Or as a [Javascript module](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules):

```js
@import { Photocylinder } from "js/photo-cylinder.js";
```

## How to start the script

```javascript
new PhotoCylinder({
  'url': photo.href,
  'sequence': urls,
  'container': document.body,
  'fov': 180,
  'idle': 0.1,
  'navigated': (url) => {},
  'opened': (url) => {},
  'closed': () => {}
});
```

**url : {String}** - The URL of the image.

**sequence : {Array}** - An optinal array or image URLs to display in sequence.

**container : {DOM Element}** - Restrict the popup to this container.

**fov : {Integer}** - Whether to use a 180 or a 360 degree field of view.

**idle : {Float}** - Steps in degrees to rotate when idle.

**navigated : {Function}** - Function that gets called when the next image in the sequence is shown.

**opened : {Function}** - Function that gets called when the viewer is opened.

**closed : {Function}** - Function that gets called when the viewer is closed.

## License

This work is licensed under a [MIT License](https://opensource.org/licenses/MIT). The latest version of this and other scripts by the same author can be found on [Github](https://github.com/WoollyMittens).
