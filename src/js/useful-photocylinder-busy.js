// extend the constructor
Photocylinder.prototype.Busy = function (container) {

	// PROPERTIES

	this.container = container;

	// METHODS

	this.show = function () {
		// construct the spinner
		this.spinner = document.createElement('div');
		this.spinner.className = (this.container === document.body) ?
			'photocylinder-busy photocylinder-busy-fixed photocylinder-busy-active':
			'photocylinder-busy photocylinder-busy-active';
		this.container.appendChild(this.spinner);
	};

	this.hide = function () {
		// deconstruct the spinner
		if (this.spinner) {
			this.container.removeChild(this.spinner);
			this.spinner = null;
		}
	};

};
