// extend the class
Photocylinder.prototype.Main = function(config, context) {

	// PROPERTIES

	this.context = context;
	this.element = config.element;
	this.config = {
		'container': document.body,
		'spherical' : /fov360/,
		'cylindrical' : /fov180/,
		'standalone': false,
		'slicer': '{src}',
		'idle': 0.1
	};

	for (var key in config) {
		this.config[key] = config[key];
	}

	// METHODS

	this.success = function(url) {
		console.log("success", url);
		var config = this.config;
		// hide the busy indicator
		this.busy.hide();
		// check if the aspect ratio of the image can be determined
		var image = config.image;
		var isWideEnough = (image.naturalWidth && image.naturalHeight && image.naturalWidth / image.naturalHeight > 3);
		// show the popup, or use the container directly
		if (config.standalone) {
			config.popup = config.container;
			config.popup.innerHTML = '';
		} else {
			this.popup = new this.context.Popup(this);
			this.popup.show();
		}
		// insert the viewer, but MSIE and low FOV should default to fallback
		this.stage = (!/msie|trident|edge/i.test(navigator.userAgent) && (this.config.spherical.test(url) || this.config.cylindrical.test(url) || isWideEnough)) ? new this.context.Stage(this) : new this.context.Fallback(this);
		this.stage.init();
		// trigger the success handler
		if (config.success) {
			config.success(config.popup);
		}
	};

	this.failure = function(url) {
		var config = this.config;
		// get rid of the image
		this.config.image = null;
		// give up on the popup
		if (this.popup) {
			// remove the popup
			config.popup.parentNode.removeChild(config.popup);
			// remove its reference
			this.popup = null;
		}
		// give up on the stage
		if (this.stage) {
			// remove the stage
			this.stage.destroy();
			config.stage.parentNode.removeChild(config.stage);
			// remove the reference
			this.stage = null;
		}
		// trigger the failure handler
		if (config.failure) {
			config.failure(config.popup);
		}
		// hide the busy indicator
		this.busy.hide();
	};

	this.destroy = function() {
		// shut down sub components
		this.stage.destroy();
	};

	// EVENTS

	this.onElementClicked = function(evt) {
		// prevent the click
		if (evt) evt.preventDefault();
		// show the busy indicator
		this.busy = new this.context.Busy(this.config.container);
		this.busy.show();
		// create the url for the image sizing webservice
	  var url = this.config.url || this.element.getAttribute('href') || this.image.getAttribute('src');
	  var size = (this.config.spherical.test(url)) ? 'height=1080&top=0.2&bottom=0.8' : 'height=1080';
		// load the image asset
		this.config.image = new Image();
		this.config.image.src = this.config.slicer.replace('{src}', url).replace('{size}', size);
		// load the viewer when done
		this.config.image.addEventListener('load', this.success.bind(this, url));
		this.config.image.addEventListener('error', this.failure.bind(this, url));
	};

	if (this.config.element) this.config.element.addEventListener('click', this.onElementClicked.bind(this));
	if (this.config.url) this.onElementClicked();

};
