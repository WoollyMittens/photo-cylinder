/*
	Source:
	van Creij, Maurice (2014). "useful.polyfills.js: A library of useful polyfills to ease working with HTML5 in legacy environments.", version 20141127, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/

// public object
var useful = useful || {};

(function() {

  // Invoke strict mode
  "use strict";

  // Create a private object for this library
  useful.polyfills = {

    // enabled the use of HTML5 elements in Internet Explorer
    html5: function() {
      var a, b, elementsList = ['section', 'nav', 'article', 'aside', 'hgroup', 'header', 'footer', 'dialog', 'mark', 'dfn', 'time', 'progress', 'meter', 'ruby', 'rt', 'rp', 'ins', 'del', 'figure', 'figcaption', 'video', 'audio', 'source', 'canvas', 'datalist', 'keygen', 'output', 'details', 'datagrid', 'command', 'bb', 'menu', 'legend'];
      if (navigator.userAgent.match(/msie/gi)) {
        for (a = 0, b = elementsList.length; a < b; a += 1) {
          document.createElement(elementsList[a]);
        }
      }
    },

    // allow array.indexOf in older browsers
    arrayIndexOf: function() {
      if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function(obj, start) {
          for (var i = (start || 0), j = this.length; i < j; i += 1) {
            if (this[i] === obj) {
              return i;
            }
          }
          return -1;
        };
      }
    },

    // allow array.isArray in older browsers
    arrayIsArray: function() {
      if (!Array.isArray) {
        Array.isArray = function(arg) {
          return Object.prototype.toString.call(arg) === '[object Array]';
        };
      }
    },

    // allow array.map in older browsers (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
    arrayMap: function() {

      // Production steps of ECMA-262, Edition 5, 15.4.4.19
      // Reference: http://es5.github.io/#x15.4.4.19
      if (!Array.prototype.map) {

        Array.prototype.map = function(callback, thisArg) {

          var T, A, k;

          if (this == null) {
            throw new TypeError(' this is null or not defined');
          }

          // 1. Let O be the result of calling ToObject passing the |this|
          //    value as the argument.
          var O = Object(this);

          // 2. Let lenValue be the result of calling the Get internal
          //    method of O with the argument "length".
          // 3. Let len be ToUint32(lenValue).
          var len = O.length >>> 0;

          // 4. If IsCallable(callback) is false, throw a TypeError exception.
          // See: http://es5.github.com/#x9.11
          if (typeof callback !== 'function') {
            throw new TypeError(callback + ' is not a function');
          }

          // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
          if (arguments.length > 1) {
            T = thisArg;
          }

          // 6. Let A be a new array created as if by the expression new Array(len)
          //    where Array is the standard built-in constructor with that name and
          //    len is the value of len.
          A = new Array(len);

          // 7. Let k be 0
          k = 0;

          // 8. Repeat, while k < len
          while (k < len) {

            var kValue, mappedValue;

            // a. Let Pk be ToString(k).
            //   This is implicit for LHS operands of the in operator
            // b. Let kPresent be the result of calling the HasProperty internal
            //    method of O with argument Pk.
            //   This step can be combined with c
            // c. If kPresent is true, then
            if (k in O) {

              // i. Let kValue be the result of calling the Get internal
              //    method of O with argument Pk.
              kValue = O[k];

              // ii. Let mappedValue be the result of calling the Call internal
              //     method of callback with T as the this value and argument
              //     list containing kValue, k, and O.
              mappedValue = callback.call(T, kValue, k, O);

              // iii. Call the DefineOwnProperty internal method of A with arguments
              // Pk, Property Descriptor
              // { Value: mappedValue,
              //   Writable: true,
              //   Enumerable: true,
              //   Configurable: true },
              // and false.

              // In browsers that support Object.defineProperty, use the following:
              // Object.defineProperty(A, k, {
              //   value: mappedValue,
              //   writable: true,
              //   enumerable: true,
              //   configurable: true
              // });

              // For best browser support, use the following:
              A[k] = mappedValue;
            }
            // d. Increase k by 1.
            k++;
          }

          // 9. return A
          return A;
        };
      }

    },

    // allow document.querySelectorAll (https://gist.github.com/connrs/2724353)
    querySelectorAll: function() {
      if (!document.querySelectorAll) {
        document.querySelectorAll = function(a) {
          var b = document,
            c = b.documentElement.firstChild,
            d = b.createElement("STYLE");
          return c.appendChild(d), b.__qsaels = [], d.styleSheet.cssText = a + "{x:expression(document.__qsaels.push(this))}", window.scrollBy(0, 0), b.__qsaels;
        };
      }
    },

    // allow addEventListener (https://gist.github.com/jonathantneal/3748027)
    addEventListener: function() {
      !window.addEventListener && (function(WindowPrototype, DocumentPrototype, ElementPrototype, addEventListener, removeEventListener, dispatchEvent, registry) {
        WindowPrototype[addEventListener] = DocumentPrototype[addEventListener] = ElementPrototype[addEventListener] = function(type, listener) {
          var target = this;
          registry.unshift([target, type, listener, function(event) {
            event.currentTarget = target;
            event.preventDefault = function() {
              event.returnValue = false;
            };
            event.stopPropagation = function() {
              event.cancelBubble = true;
            };
            event.target = event.srcElement || target;
            listener.call(target, event);
          }]);
          this.attachEvent("on" + type, registry[0][3]);
        };
        WindowPrototype[removeEventListener] = DocumentPrototype[removeEventListener] = ElementPrototype[removeEventListener] = function(type, listener) {
          for (var index = 0, register; register = registry[index]; ++index) {
            if (register[0] == this && register[1] == type && register[2] == listener) {
              return this.detachEvent("on" + type, registry.splice(index, 1)[0][3]);
            }
          }
        };
        WindowPrototype[dispatchEvent] = DocumentPrototype[dispatchEvent] = ElementPrototype[dispatchEvent] = function(eventObject) {
          return this.fireEvent("on" + eventObject.type, eventObject);
        };
      })(Window.prototype, HTMLDocument.prototype, Element.prototype, "addEventListener", "removeEventListener", "dispatchEvent", []);
    },

    // allow console.log
    consoleLog: function() {
      var overrideTest = new RegExp('console-log', 'i');
      if (!window.console || overrideTest.test(document.querySelectorAll('html')[0].className)) {
        window.console = {};
        window.console.log = function() {
          // if the reporting panel doesn't exist
          var a, b, messages = '',
            reportPanel = document.getElementById('reportPanel');
          if (!reportPanel) {
            // create the panel
            reportPanel = document.createElement('DIV');
            reportPanel.id = 'reportPanel';
            reportPanel.style.background = '#fff none';
            reportPanel.style.border = 'solid 1px #000';
            reportPanel.style.color = '#000';
            reportPanel.style.fontSize = '12px';
            reportPanel.style.padding = '10px';
            reportPanel.style.position = (navigator.userAgent.indexOf('MSIE 6') > -1) ? 'absolute' : 'fixed';
            reportPanel.style.right = '10px';
            reportPanel.style.bottom = '10px';
            reportPanel.style.width = '180px';
            reportPanel.style.height = '320px';
            reportPanel.style.overflow = 'auto';
            reportPanel.style.zIndex = '100000';
            reportPanel.innerHTML = '&nbsp;';
            // store a copy of this node in the move buffer
            document.body.appendChild(reportPanel);
          }
          // truncate the queue
          var reportString = (reportPanel.innerHTML.length < 1000) ? reportPanel.innerHTML : reportPanel.innerHTML.substring(0, 800);
          // process the arguments
          for (a = 0, b = arguments.length; a < b; a += 1) {
            messages += arguments[a] + '<br/>';
          }
          // add a break after the message
          messages += '<hr/>';
          // output the queue to the panel
          reportPanel.innerHTML = messages + reportString;
        };
      }
    },

    // allows Object.create (https://gist.github.com/rxgx/1597825)
    objectCreate: function() {
      if (typeof Object.create !== "function") {
        Object.create = function(original) {
          function Clone() {}
          Clone.prototype = original;
          return new Clone();
        };
      }
    },

    // allows String.trim (https://gist.github.com/eliperelman/1035982)
    stringTrim: function() {
      if (!String.prototype.trim) {
        String.prototype.trim = function() {
          return this.replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '');
        };
      }
      if (!String.prototype.ltrim) {
        String.prototype.ltrim = function() {
          return this.replace(/^\s+/, '');
        };
      }
      if (!String.prototype.rtrim) {
        String.prototype.rtrim = function() {
          return this.replace(/\s+$/, '');
        };
      }
      if (!String.prototype.fulltrim) {
        String.prototype.fulltrim = function() {
          return this.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, '').replace(/\s+/g, ' ');
        };
      }
    },

    // allows localStorage support
    localStorage: function() {
      if (!window.localStorage) {
        if (/MSIE 8|MSIE 7|MSIE 6/i.test(navigator.userAgent)) {
          window.localStorage = {
            getItem: function(sKey) {
              if (!sKey || !this.hasOwnProperty(sKey)) {
                return null;
              }
              return unescape(document.cookie.replace(new RegExp("(?:^|.*;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1"));
            },
            key: function(nKeyId) {
              return unescape(document.cookie.replace(/\s*\=(?:.(?!;))*$/, "").split(/\s*\=(?:[^;](?!;))*[^;]?;\s*/)[nKeyId]);
            },
            setItem: function(sKey, sValue) {
              if (!sKey) {
                return;
              }
              document.cookie = escape(sKey) + "=" + escape(sValue) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";
              this.length = document.cookie.match(/\=/g).length;
            },
            length: 0,
            removeItem: function(sKey) {
              if (!sKey || !this.hasOwnProperty(sKey)) {
                return;
              }
              document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
              this.length--;
            },
            hasOwnProperty: function(sKey) {
              return (new RegExp("(?:^|;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
            }
          };
          window.localStorage.length = (document.cookie.match(/\=/g) || window.localStorage).length;
        } else {
          Object.defineProperty(window, "localStorage", new(function() {
            var aKeys = [],
              oStorage = {};
            Object.defineProperty(oStorage, "getItem", {
              value: function(sKey) {
                return sKey ? this[sKey] : null;
              },
              writable: false,
              configurable: false,
              enumerable: false
            });
            Object.defineProperty(oStorage, "key", {
              value: function(nKeyId) {
                return aKeys[nKeyId];
              },
              writable: false,
              configurable: false,
              enumerable: false
            });
            Object.defineProperty(oStorage, "setItem", {
              value: function(sKey, sValue) {
                if (!sKey) {
                  return;
                }
                document.cookie = escape(sKey) + "=" + escape(sValue) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";
              },
              writable: false,
              configurable: false,
              enumerable: false
            });
            Object.defineProperty(oStorage, "length", {
              get: function() {
                return aKeys.length;
              },
              configurable: false,
              enumerable: false
            });
            Object.defineProperty(oStorage, "removeItem", {
              value: function(sKey) {
                if (!sKey) {
                  return;
                }
                document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
              },
              writable: false,
              configurable: false,
              enumerable: false
            });
            this.get = function() {
              var iThisIndx;
              for (var sKey in oStorage) {
                iThisIndx = aKeys.indexOf(sKey);
                if (iThisIndx === -1) {
                  oStorage.setItem(sKey, oStorage[sKey]);
                } else {
                  aKeys.splice(iThisIndx, 1);
                }
                delete oStorage[sKey];
              }
              for (aKeys; aKeys.length > 0; aKeys.splice(0, 1)) {
                oStorage.removeItem(aKeys[0]);
              }
              for (var aCouple, iKey, nIdx = 0, aCouples = document.cookie.split(/\s*;\s*/); nIdx < aCouples.length; nIdx++) {
                aCouple = aCouples[nIdx].split(/\s*=\s*/);
                if (aCouple.length > 1) {
                  oStorage[iKey = unescape(aCouple[0])] = unescape(aCouple[1]);
                  aKeys.push(iKey);
                }
              }
              return oStorage;
            };
            this.configurable = false;
            this.enumerable = true;
          })());
        }
      }
    },

    // allows bind support
    functionBind: function() {
      // Credit to Douglas Crockford for this bind method
      if (!Function.prototype.bind) {
        Function.prototype.bind = function(oThis) {
          if (typeof this !== "function") {
            // closest thing possible to the ECMAScript 5 internal IsCallable function
            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
          }
          var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP = function() {},
            fBound = function() {
              return fToBind.apply(this instanceof fNOP && oThis ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
            };
          fNOP.prototype = this.prototype;
          fBound.prototype = new fNOP();
          return fBound;
        };
      }
    }

  };

  // startup
  useful.polyfills.html5();
  useful.polyfills.arrayIndexOf();
  useful.polyfills.arrayIsArray();
  useful.polyfills.arrayMap();
  useful.polyfills.querySelectorAll();
  useful.polyfills.addEventListener();
  useful.polyfills.consoleLog();
  useful.polyfills.objectCreate();
  useful.polyfills.stringTrim();
  useful.polyfills.localStorage();
  useful.polyfills.functionBind();

  // return as a require.js module
  if (typeof module !== 'undefined') {
    exports = module.exports = useful.polyfills;
  }

})();

/*
	Source:
	van Creij, Maurice (2014). "useful.requests.js: A library of useful functions to ease working with AJAX and JSON.", version 20141127, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/

// public object
var useful = useful || {};

(function(){

	// Invoke strict mode
	"use strict";

	// Create a private object for this library
	useful.request = {

		// adds a random argument to the AJAX URL to bust the cache
		randomise : function (url) {
			return url.replace('?', '?time=' + new Date().getTime() + '&');
		},

		// perform all requests in a single application
		all : function (queue, results) {
			// set up storage for the results
			var _this = this, _url = queue.urls[queue.urls.length - 1], _results = results || [];
			// perform the first request in the queue
			this.send({
				url : _url,
				post : queue.post || null,
				contentType : queue.contentType || 'text/xml',
				timeout : queue.timeout || 4000,
				onTimeout : queue.onTimeout || function (reply) { return reply; },
				onProgress : function (reply) {
					// report the fractional progress of the whole queue
					queue.onProgress({});
				},
				onFailure : queue.onFailure || function (reply) { return reply; },
				onSuccess : function (reply) {
					// store the results
					_results.push({
						'url' : _url,
						'response' : reply.response,
						'responseText' : reply.responseText,
						'responseXML' : reply.responseXML,
						'status' : reply.status,
					});
					// pop one request off the queue
					queue.urls.length = queue.urls.length - 1;
					// if there are more items in the queue
					if (queue.urls.length > 0) {
						// perform the next request
						_this.all(queue, _results);
					// else
					} else {
						// trigger the success handler
						queue.onSuccess(_results);
					}
				}
			});
		},

		// create a request that is compatible with the browser
		create : function (properties) {
			var serverRequest,
				_this = this;
			// create a microsoft only xdomain request
			if (window.XDomainRequest && properties.xdomain) {
				// create the request object
				serverRequest = new XDomainRequest();
				// add the event handler(s)
				serverRequest.onload = function () { properties.onSuccess(serverRequest, properties); };
				serverRequest.onerror = function () { properties.onFailure(serverRequest, properties); };
				serverRequest.ontimeout = function () { properties.onTimeout(serverRequest, properties); };
				serverRequest.onprogress = function () { properties.onProgress(serverRequest, properties); };
			}
			// or create a standard HTTP request
			else if (window.XMLHttpRequest) {
				// create the request object
				serverRequest = new XMLHttpRequest();
				// set the optional timeout if available
				if (serverRequest.timeout) { serverRequest.timeout = properties.timeout || 0; }
				// add the event handler(s)
				serverRequest.ontimeout = function () { properties.onTimeout(serverRequest, properties); };
				serverRequest.onreadystatechange = function () { _this.update(serverRequest, properties); };
			}
			// or use the fall back
			else {
				// create the request object
				serverRequest = new ActiveXObject("Microsoft.XMLHTTP");
				// add the event handler(s)
				serverRequest.onreadystatechange = function () { _this.update(serverRequest, properties); };
			}
			// return the request object
			return serverRequest;
		},

		// perform and handle an AJAX request
		send : function (properties) {
			// add any event handlers that weren't provided
			properties.onSuccess = properties.onSuccess || function () {};
			properties.onFailure = properties.onFailure || function () {};
			properties.onTimeout = properties.onTimeout || function () {};
			properties.onProgress = properties.onProgress || function () {};
			// create the request object
			var serverRequest = this.create(properties);
			// if the request is a POST
			if (properties.post) {
				try {
					// open the request
					serverRequest.open('POST', properties.url, true);
					// set its header
					serverRequest.setRequestHeader("Content-type", properties.contentType || "application/x-www-form-urlencoded");
					// send the request, or fail gracefully
					serverRequest.send(properties.post);
				}
				catch (errorMessage) { properties.onFailure({ readyState : -1, status : -1, statusText : errorMessage }); }
			// else treat it as a GET
			} else {
				try {
					// open the request
					serverRequest.open('GET', this.randomise(properties.url), true);
					// send the request
					serverRequest.send();
				}
				catch (errorMessage) { properties.onFailure({ readyState : -1, status : -1, statusText : errorMessage }); }
			}
		},

		// regularly updates the status of the request
		update : function (serverRequest, properties) {
			// react to the status of the request
			if (serverRequest.readyState === 4) {
				switch (serverRequest.status) {
					case 200 :
						properties.onSuccess(serverRequest, properties);
						break;
					case 304 :
						properties.onSuccess(serverRequest, properties);
						break;
					default :
						properties.onFailure(serverRequest, properties);
				}
			} else {
				properties.onProgress(serverRequest, properties);
			}
		},

		// turns a string back into a DOM object
		deserialize : function (text) {
			var parser, xmlDoc;
			// if the DOMParser exists
			if (window.DOMParser) {
				// parse the text as an XML DOM
				parser = new DOMParser();
				xmlDoc = parser.parseFromString(text, "text/xml");
			// else assume this is Microsoft doing things differently again
			} else {
				// parse the text as an XML DOM
				xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
				xmlDoc.async = "false";
				xmlDoc.loadXML(text);
			}
			// return the XML DOM object
			return xmlDoc;
		},

		// turns a json string into a JavaScript object
		decode : function (text) {
			var object;
			object = {};
			// if JSON.parse is available
			if (typeof JSON !== 'undefined' && typeof JSON.parse !== 'undefined') {
				// use it
				object = JSON.parse(text);
			// if jQuery is available
			} else if (typeof jQuery !== 'undefined') {
				// use it
				object = jQuery.parseJSON(text);
			}
			// return the object
			return object;
		}

	};

	// return as a require.js module
	if (typeof module !== 'undefined') {
		exports = module.exports = useful.request;
	}

})();

/*
	Source:
	van Creij, Maurice (2018). "useful-photocylinder.js: Displays a cylindrical projection of a panoramic image.", version 20180102, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/

// create the constructor if needed
var useful = useful || {};
useful.Photocylinder = useful.Photocylinder || function () {};

// extend the constructor
useful.Photocylinder.prototype.Busy = function (container) {

	// PROPERTIES

	"use strict";
	this.container = container;

	// METHODS

	this.init = function () {
		// not needed yet
	};

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

// return as a require.js module
if (typeof module !== 'undefined') {
	exports = module.exports = useful.Photocylinder.Busy;
}

/*
	Source:
	van Creij, Maurice (2018). "useful-photocylinder.js: Displays a cylindrical projection of a panoramic image.", version 20180102, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/

// create the constructor if needed
var useful = useful || {};
useful.Photocylinder = useful.Photocylinder || function () {};

// extend the constructor
useful.Photocylinder.prototype.Fallback = function (parent) {

	"use strict";

	// PROPERTIES

	this.parent = parent;
    this.config = parent.config;
	this.popup = this.config.popup;
	this.image = this.config.image;
	this.imageAspect = null;
	this.wrapper = null;
	this.wrapperAspect = null;
	this.fov = null;
	this.magnification = {};
	this.horizontal = {};
	this.vertical = {};
	this.tracked = null;
	this.increment = this.config.idle / 200;
	this.auto = true;

	// METHODS

	this.init = function() {
		// prepare the markup
		this.build();
		// render the display
		this.render();
		// add the controls
		this.controls();
		// rescale after resize
		this.resizeListener = this.resize.bind(this);
		window.addEventListener('resize', this.resizeListener, true);

	};

	this.destroy = function() {
		// cancel all global event listeners
		window.removeEventListener('resize', this.resizeListener, true);
		window.removeEventListener('deviceorientation', this.tiltListener, true);
	};

	this.build = function() {
		// add the wrapper
		this.wrapper = document.createElement('div');
		this.wrapper.setAttribute('class', 'photo-cylinder pc-fallback');
		// TODO: for 360deg images the image needs to be doubled to allow looping
		var clonedImage = this.image.cloneNode(true);
		// add markup here
		this.wrapper.appendChild(this.image);
		// insert the object
		this.popup.appendChild(this.wrapper);
	};

	this.render = function() {
		// get the aspect ratio from the image
		this.imageAspect = this.image.offsetWidth / this.image.offsetHeight;
		// calculate the zoom limits
		this.magnification.min = 1; // TODO: make sure the image fills the width and height
		this.magnification.max = 4;
		// set the initial rotation
		this.recentre();
		// set the initial zoom
		this.resize();
		// if the image is wide enough, start the idle animation
		if (this.imageAspect - this.wrapperAspect >= 1) this.animate();
	};

	this.controls = function() {
		// add touch controls
		this.wrapper.addEventListener('touchstart', this.touch.bind(this, 'start'));
		this.wrapper.addEventListener('touchmove', this.touch.bind(this, 'move'));
		this.wrapper.addEventListener('touchend', this.touch.bind(this, 'end'));
		// add mouse controls
		this.wrapper.addEventListener('mousedown', this.touch.bind(this, 'start'));
		this.wrapper.addEventListener('mousemove', this.touch.bind(this, 'move'));
		this.wrapper.addEventListener('mouseup', this.touch.bind(this, 'end'));
		this.wrapper.addEventListener('mousewheel', this.wheel.bind(this));
	    this.wrapper.addEventListener('DOMMouseScroll', this.wheel.bind(this));
		// add tilt contols
		this.tiltListener = this.tilt.bind(this);
		window.addEventListener("deviceorientation", this.tiltListener, true);
	};

	this.coords = function(evt) {
		return {
			x: evt.screenX || evt.touches[0].screenX,
			y: evt.screenY || evt.touches[0].screenY,
			z: (evt.touches && evt.touches.length > 1) ? Math.abs(evt.touches[0].screenX - evt.touches[1].screenX + evt.touches[0].screenY - evt.touches[1].screenY) : 0
		}
	};

	this.recentre = function() {
		// reset the initial position
		this.magnification.current = this.magnification.min * 1.25;
		this.horizontal.current = 0.5;
		this.vertical.current = 0.5;
	};

	this.magnify = function(factor) {
		// limit the zoom
		this.magnification.current = Math.max(Math.min(factor, this.magnification.max), this.magnification.min);
		// (re)calculate the movement limits
		this.horizontal.min = Math.min(0.5 - (this.magnification.current -  this.wrapperAspect / this.imageAspect) / 2, 0.5);
		this.horizontal.max = Math.max(1 - this.horizontal.min, 0.5);
		this.horizontal.current = Math.max(Math.min(this.horizontal.current, this.horizontal.max), this.horizontal.min);
		this.vertical.min = Math.min(0.5 - (this.magnification.current - 1) / 2, 0.5);
		this.vertical.max = Math.max(1 - this.vertical.min, 0.5);
		this.vertical.current = Math.max(Math.min(this.vertical.current, this.vertical.max), this.vertical.min);
		// implement the zoom
		this.redraw();
	};

	this.move = function(horizontal, vertical) {
		// implement the movement
		this.horizontal.current = Math.max(Math.min(horizontal, this.horizontal.max), this.horizontal.min);
		this.vertical.current = Math.max(Math.min(vertical, this.vertical.max), this.vertical.min);
		// implement the zoom
		this.redraw();
	};

	this.momentum = function() {
		// on requestAnimationFrame count down the delta vectors to ~0
		if (this.magnification.delta || this.horizontal.delta || this.vertical.delta) {
			// reduce the increment
			this.magnification.delta = (Math.abs(this.magnification.delta) > 0.0001) ? this.magnification.delta / 1.05 : 0;
			this.horizontal.delta = (Math.abs(this.horizontal.delta) > 0.001) ? this.horizontal.delta / 1.05 : 0;
			this.vertical.delta = (Math.abs(this.vertical.delta) > 0.001) ? this.vertical.delta / 1.05 : 0;
			// advance rotation incrementally
			this.move(this.horizontal.current + this.horizontal.delta, this.vertical.current + this.vertical.delta);
			this.magnify(this.magnification.current + this.magnification.delta);
			// wait for the next render
			window.requestAnimationFrame(this.momentum.bind(this));
		}
	};

	this.redraw = function() {
		// apply all transformations in one go
		this.image.style.transform = 'translate(' + (this.horizontal.current * -100) + '%, ' + (this.vertical.current * -100) + '%) scale(' + this.magnification.current + ', ' + this.magnification.current + ')';
	};

	this.animate = function(allow) {
		// accept overrides
		if (typeof allow === 'boolean') {
			this.auto = allow;
		}
		// if animation is allowed
		if (this.auto) {
			// in 180 degree pictures adjust increment and reverse, otherwise loop forever
			if (this.horizontal.current + this.increment * 2 > this.horizontal.max) this.increment = -this.config.idle / 200;
			if (this.horizontal.current + this.increment * 2 < this.horizontal.min) this.increment = this.config.idle / 200;
			var step = this.horizontal.current + this.increment;
			// advance rotation incrementally, until interrupted
			this.move(step, this.vertical.current);
			window.requestAnimationFrame(this.animate.bind(this));
		}
	};

	// EVENTS

	this.tilt = function(evt) {
		// stop animating
		this.auto = false;
		// if there was tilt before and the jump is not extreme
		if (this.horizontal.tilted && this.vertical.tilted && Math.abs(evt.alpha - this.horizontal.tilted) < 45 && Math.abs(evt.beta - this.vertical.tilted) < 45) {
			// update the rotation
			this.move(
				this.horizontal.current - (evt.alpha - this.horizontal.tilted) / 180,
				this.vertical.current - (evt.beta - this.vertical.tilted) / 180
			);
		}
		// store the tilt
		this.horizontal.tilted = evt.alpha;
		this.vertical.tilted = evt.beta;
	};

	this.wheel = function(evt) {
		// cancel the scrolling
		evt.preventDefault();
		// stop animating
		this.auto = false;
		// reset the deltas
		this.magnification.delta = 0;
		// get the feedback
		var coords = this.coords(evt);
		var distance = evt.deltaY || evt.wheelDeltaY || evt.wheelDelta;
		this.magnification.delta = distance / this.wrapper.offsetHeight;
		this.magnify(this.magnification.current + this.magnification.delta);
		// continue based on inertia
		this.momentum();
	};

	this.touch = function(phase, evt) {
		// cancel the click
		evt.preventDefault();
		// pick the phase of interaction
		var coords, scale = this.magnification.current / this.magnification.min;
		switch(phase) {
			case 'start':
				// stop animating
				this.auto = false;
				// reset the deltas
				this.magnification.delta = 0;
				this.horizontal.delta = 0;
				this.vertical.delta = 0;
				// start tracking
				this.tracked = this.coords(evt);
				break;
			case 'move':
				if (this.tracked) {
					coords = this.coords(evt);
					// store the momentum
					this.magnification.delta = (this.tracked.z - coords.z) / this.wrapper.offsetWidth * scale * 2;
					this.horizontal.delta = (this.tracked.x - coords.x) / this.wrapper.offsetWidth * scale / this.imageAspect;
					this.vertical.delta = (this.tracked.y - coords.y) / this.wrapper.offsetHeight * scale;
					// calculate the position
					this.move(this.horizontal.current + this.horizontal.delta, this.vertical.current + this.vertical.delta);
					// calculate the zoom
					this.magnify(this.magnification.current - this.magnification.delta);
					// update the step
					this.tracked.x = coords.x;
					this.tracked.y = coords.y;
					this.tracked.z = coords.z;
				}
				break;
			case 'end':
				// stop tracking
				this.tracked = null;
				// continue based on inertia
				this.momentum();
				break;
		}
	};

	this.resize = function() {
		// update the aspect ratio
		this.wrapperAspect = this.wrapper.offsetWidth / this.wrapper.offsetHeight;
		// restore current values
		var factor = this.magnification.current || 1;
		var horizontal = this.horizontal.current || 0.5;
		var vertical = this.vertical.current || 0.5;
		// reset to zoom
		this.magnify(factor);
		// reset the rotation
		this.move(horizontal, vertical);
	};

};

// return as a require.js module
if (typeof module !== 'undefined') {
	exports = module.exports = useful.Photocylinder.Fallback;
}

/*
	Source:
	van Creij, Maurice (2018). "useful-photocylinder.js: Displays a cylindrical projection of a panoramic image.", version 20180102, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/

// create the constructor if needed
var useful = useful || {};
useful.Photocylinder = useful.Photocylinder || function() {};

// extend the constructor
useful.Photocylinder.prototype.Main = function(config, context) {

	"use strict";

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

	for (name in config) {
		this.config[name] = config[name];
	}

	// METHODS

	this.init = function() {
    // if an element was provided, add the event listener
    if (this.config.element) this.config.element.addEventListener('click', this.onElementClicked.bind(this));
    // or if a url was provided trigger the event immediately
  	if (this.config.url) this.onElementClicked();
  };

	this.success = function(url) {
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
			config.success(config.container);
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
			config.failure(config.container);
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

};

// return as a require.js module
if (typeof module !== 'undefined') {
	exports = module.exports = useful.Photocylinder.Main;
}

/*
	Source:
	van Creij, Maurice (2018). "useful-photocylinder.js: Displays a cylindrical projection of a panoramic image.", version 20180102, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/

// create the constructor if needed
var useful = useful || {};
useful.Photocylinder = useful.Photocylinder || function() {};

// extend the constructor
useful.Photocylinder.prototype.Popup = function(parent) {

	"use strict";

	// PROPERTIES

	this.parent = parent;
	this.config = parent.config;

	// METHODS

	this.show = function() {
		var config = this.config;
		// if the popup doesn't exist
		if (!config.popup) {
			// create a container for the popup
			config.popup = document.createElement('figure');
			config.popup.className = (config.container === document.body)
				? 'photocylinder-popup photocylinder-popup-fixed photocylinder-popup-passive'
				: 'photocylinder-popup photocylinder-popup-passive';
			// add a close gadget
			this.addCloser();
			// add a locator gadget
			this.addLocator();
			// add the popup to the document
			config.container.appendChild(config.popup);
			// reveal the popup when ready
			setTimeout(this.onShow.bind(this), 0);
		}
	};

	this.hide = function() {
		var config = this.config;
		// if there is a popup
		if (config.popup) {
			// unreveal the popup
			config.popup.className = config.popup.className.replace(/-active/gi, '-passive');
			// and after a while
			var _this = this;
			setTimeout(function() {
				// remove it
				config.container.removeChild(config.popup);
				// remove its reference
				config.popup = null;
				// ask the parent to self destruct
				_this.parent.destroy();
			}, 500);
		}
	};

	this.addCloser = function() {
		var config = this.config;
		// build a close gadget
		var closer = document.createElement('a');
		closer.className = 'photocylinder-closer';
		closer.innerHTML = 'x';
		closer.href = '#close';
		// add the close event handler
		closer.addEventListener('click', this.onHide.bind(this));
		closer.addEventListener('touchstart', this.onHide.bind(this));
		// add the close gadget to the image
		config.popup.appendChild(closer);
	};

	this.addLocator = function(url) {
		var config = this.config;
		// only add if a handler was specified
		if (config.located) {
			// build the geo marker icon
			var locator = document.createElement('a');
			locator.className = 'photocylinder-locator';
			locator.innerHTML = 'Show on a map';
			locator.href = '#map';
			// add the event handler
			locator.addEventListener('click', this.onLocate.bind(this));
			locator.addEventListener('touchstart', this.onLocate.bind(this));
			// add the location marker to the image
			config.popup.appendChild(locator);
		}
	};

	// EVENTS

	this.onShow = function() {
		var config = this.config;
		// show the popup
		config.popup.className = config.popup.className.replace(/-passive/gi, '-active');
		// trigger the closed event if available
		if (config.opened) {
			config.opened(config.element);
		}
	};

	this.onHide = function(evt) {
		var config = this.config;
		// cancel the click
		evt.preventDefault();
		// close the popup
		this.hide();
		// trigger the closed event if available
		if (config.closed) {
			config.closed(config.element);
		}
	};

	this.onLocate = function(evt) {
		var config = this.config;
		// cancel the click
		evt.preventDefault();
		// trigger the located event if available
		if (config.located) {
			config.located(config.element);
		}
	};

};

// return as a require.js module
if (typeof module !== 'undefined') {
	exports = module.exports = useful.Photocylinder.Popup;
}

/*
	Source:
	van Creij, Maurice (2018). "useful-photocylinder.js: Displays a cylindrical projection of a panoramic image.", version 20180102, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/

// create the constructor if needed
var useful = useful || {};
useful.Photocylinder = useful.Photocylinder || function () {};

// extend the constructor
useful.Photocylinder.prototype.Stage = function (parent) {

	"use strict";

	// PROPERTIES

	this.parent = parent;
  this.config = parent.config;
	this.popup = this.config.popup;
	this.image = this.config.image;
	this.imageAspect = null;
	this.wrapper = null;
	this.wrapperAspect = null;
	this.baseAngle = 60;
	this.baseSize = 500;
	this.obj = null;
	this.objRow = null;
	this.objCols = [];
	this.fov = null;
	this.magnification = {};
	this.rotation = {};
	this.offset = {};
	this.tracked = null;
	this.increment = this.config.idle;
	this.auto = true;

	// METHODS

	this.init = function() {
		// prepare the markup
		this.build();
		// render the display
		this.render();
		// add the controls
		this.controls();
		// rescale after resize
		this.resizeListener = this.resize.bind(this);
		window.addEventListener('resize', this.resizeListener, true);
	};

	this.destroy = function() {
		// cancel all global event listeners
		window.removeEventListener('resize', this.resizeListener, true);
		window.removeEventListener('deviceorientation', this.tiltListener, true);
	};

	this.build = function() {
		// add the wrapper
		this.wrapper = document.createElement('div');
		this.wrapper.setAttribute('class', 'photo-cylinder');
		// add the row object
		this.objRow = document.createElement('div');
		this.objRow.setAttribute('class', 'pc-obj-row');
		this.wrapper.appendChild(this.objRow);
		// add the column oblects
		for (var a = 0, b = 8; a < b; a += 1) {
			this.objCols[a] = document.createElement('span');
			this.objCols[a].setAttribute('class', 'pc-obj-col pc-obj-col-' + a);
			this.objRow.appendChild(this.objCols[a]);
		}
		// add the image
		this.wrapper.appendChild(this.image);
		// insert the object
		this.popup.appendChild(this.wrapper);
		// remember the object
		this.config.stage = this.wrapper;
	};

	this.render = function() {
		// retrieve the field of view from the image source
		var url = this.image.getAttribute('src');
		this.fov = this.config.spherical.test(url) ? 360 : 180;
		// get the aspect ratio from the image
		this.imageAspect = this.image.offsetWidth / this.image.offsetHeight;
		// get the field of view property or guess one
		this.wrapper.className += (this.fov < 360) ? ' pc-180' : ' pc-360';
		// calculate the zoom limits - scale = aspect * (360 / fov) * 0.3
		this.magnification.min = Math.max(this.imageAspect * (360 / this.fov) * 0.3, 1);
		this.magnification.max = 4;
		this.magnification.current = this.magnification.min * 1.25;
		// the offset limits are 0 at zoom level 1 be definition, because there is no overscan
		this.offset.min = 0;
		this.offset.max = 0;
		// set the image source as the background image for the polygons
		for (var a = 0, b = this.objCols.length; a < b; a += 1) {
			this.objCols[a].style.backgroundImage = "url('" + url + "')";
		}
		// set the initial zoom
		this.resize();
		// set the initial rotation
		this.recentre();
		// start the idle animation
		this.animate();
	};

	this.controls = function() {
		// add touch controls
		this.wrapper.addEventListener('touchstart', this.touch.bind(this, 'start'));
		this.wrapper.addEventListener('touchmove', this.touch.bind(this, 'move'));
		this.wrapper.addEventListener('touchend', this.touch.bind(this, 'end'));
		// add mouse controls
		this.wrapper.addEventListener('mousedown', this.touch.bind(this, 'start'));
		this.wrapper.addEventListener('mousemove', this.touch.bind(this, 'move'));
		this.wrapper.addEventListener('mouseup', this.touch.bind(this, 'end'));
		this.wrapper.addEventListener('mousewheel', this.wheel.bind(this));
		this.wrapper.addEventListener('DOMMouseScroll', this.wheel.bind(this));
		// add tilt contols
		this.tiltListener = this.tilt.bind(this);
		window.addEventListener("deviceorientation", this.tiltListener, true);
	};

	this.coords = function(evt) {
		return {
			x: evt.screenX || evt.touches[0].screenX,
			y: evt.screenY || evt.touches[0].screenY,
			z: (evt.touches && evt.touches.length > 1) ? Math.abs(evt.touches[0].screenX - evt.touches[1].screenX + evt.touches[0].screenY - evt.touches[1].screenY) : 0
		}
	};

	this.recentre = function() {
		// reset the initial rotation
		this.rotate(this.fov/2);
	};

	this.magnify = function(factor, offset) {
		// limit the zoom
		this.magnification.current = Math.max(Math.min(factor, this.magnification.max), this.magnification.min);
		// calculate the view angle
		this.baseAngle = 60 * this.wrapperAspect * (this.magnification.min / this.magnification.current);
		// centre the zoom
		this.offset.max = (this.magnification.current - this.magnification.min) / 8;
		this.offset.min = -1 * this.offset.max;
		this.offset.current = Math.max(Math.min(offset, this.offset.max), this.offset.min);
		// calculate the rotation limits
		var overscanAngle = (this.baseAngle - 360 / this.objCols.length) / 2;
		this.rotation.min = (this.fov < 360) ? overscanAngle : 0;
		this.rotation.max = (this.fov < 360) ? this.fov - this.baseAngle + overscanAngle : this.fov;
		// redraw the object
		this.redraw();
	};

	this.rotate = function(angle) {
		// limit or loop the rotation
		this.rotation.current = (this.fov < 360) ? Math.max(Math.min(angle, this.rotation.max), this.rotation.min) : angle%360 ;
		// redraw the object
		this.redraw();
	};

	this.momentum = function() {
		// on requestAnimationFrame count down the delta vectors to ~0
		if (this.rotation.delta || this.magnification.delta || this.offset.delta) {
			// reduce the increment
			this.rotation.delta = (Math.abs(this.rotation.delta) > 0.1) ? this.rotation.delta / 1.05 : 0;
			this.magnification.delta = (Math.abs(this.magnification.delta) > 0.0001) ? this.magnification.delta / 1.05 : 0;
			this.offset.delta = (Math.abs(this.offset.delta) > 0.001) ? this.offset.delta / 1.05 : 0;
			// advance rotation incrementally
			this.rotate(this.rotation.current + this.rotation.delta);
			this.magnify(this.magnification.current + this.magnification.delta, this.offset.current + this.offset.delta);
			// wait for the next render
			window.requestAnimationFrame(this.momentum.bind(this));
		}
	};

	this.redraw = function() {
		// update the relative scale
		var scale = this.wrapper.offsetHeight / this.baseSize;
		// apply all transformations in one go
		this.objRow.style.transform = 'translate(-50%, ' + ((0.5 + this.offset.current * scale) * -100) + '%) scale(' + (this.magnification.current * scale) + ') rotateY(' + this.rotation.current + 'deg)';
	};

	this.animate = function(allow) {
		// accept overrides
		if (typeof allow === 'boolean') {
			this.auto = allow;
		}
		// if animation is allowed
		if (this.auto) {
			// in 180 degree pictures adjust increment and reverse, otherwise loop forever
			if (this.rotation.current + this.increment * 2 > this.rotation.max) this.increment = -this.config.idle;
			if (this.rotation.current + this.increment * 2 < this.rotation.min) this.increment = this.config.idle;
			var step = (this.fov < 360) ? this.rotation.current + this.increment : (this.rotation.current + this.increment) % 360;
			// advance rotation incrementally, until interrupted
			this.rotate(step);
			window.requestAnimationFrame(this.animate.bind(this));
		}
	};

	// EVENTS

	this.tilt = function(evt) {
		// stop animating
		this.auto = false;
		// if there was tilt before and the jump is not extreme
		if (this.rotation.tilted && Math.abs(evt.alpha - this.rotation.tilted) < 45) {
			// update the rotation
			this.rotate(this.rotation.current + evt.alpha - this.rotation.tilted);
		}
		// store the tilt
		this.rotation.tilted = evt.alpha;
	};

	this.wheel = function(evt) {
		// cancel the scrolling
		evt.preventDefault();
		// stop animating
		this.auto = false;
		// reset the deltas
		this.magnification.delta = 0;
		// get the feedback
		var coords = this.coords(evt);
		var distance = evt.deltaY || evt.wheelDeltaY || evt.wheelDelta;
		this.magnification.delta = distance / this.wrapper.offsetHeight;
		this.magnify(this.magnification.current + this.magnification.delta, this.offset.current);
		// continue based on inertia
		this.momentum();
	};

	this.touch = function(phase, evt) {
		// cancel the click
		evt.preventDefault();
		// pick the phase of interaction
		var coords, scale = this.magnification.current / this.magnification.min;
		switch(phase) {
			case 'start':
				// stop animating
				this.auto = false;
				// reset the deltas
				this.rotation.delta = 0;
				this.magnification.delta = 0;
				this.offset.delta = 0;
				// start tracking
				this.tracked = this.coords(evt);
				break;
			case 'move':
				if (this.tracked) {
					coords = this.coords(evt);
					// store the momentum
					this.rotation.delta = this.baseAngle * (this.tracked.x - coords.x) / this.wrapper.offsetWidth * scale;
					this.magnification.delta = (this.tracked.z - coords.z) / this.wrapper.offsetWidth * scale * 2;
					this.offset.delta = (this.tracked.y - coords.y) / this.wrapper.offsetHeight;
					// calculate the rotation
					this.rotate(this.rotation.current + this.rotation.delta);
					// calculate the zoom
					this.magnify(this.magnification.current - this.magnification.delta, this.offset.current + this.offset.delta);
					// update the step
					this.tracked.x = coords.x;
					this.tracked.y = coords.y;
					this.tracked.z = coords.z;
				}
				break;
			case 'end':
				// stop tracking
				this.tracked = null;
				// continue based on inertia
				this.momentum();
				break;
		}
	};

	this.resize = function() {
		// update the wrapper aspect ratio
		this.wrapperAspect = (this.wrapper.offsetWidth / this.wrapper.offsetHeight);
		// restore current values
		var factor = this.magnification.current || 1;
		var offset = this.offset.current || 0;
		var angle = this.rotation.current || this.fov/2;
		// reset to zoom
		this.magnify(factor, offset);
		// reset the rotation
		this.rotate(angle);
	};

};

// return as a require.js module
if (typeof module !== 'undefined') {
	exports = module.exports = useful.Photocylinder.Stage;
}

/*
	Source:
	van Creij, Maurice (2018). "useful-photocylinder.js: Displays a cylindrical projection of a panoramic image.", version 20180102, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/

// create the class if needed
var useful = useful || {};
useful.Photocylinder = useful.Photocylinder || function () {};

// add the prototype methods
useful.Photocylinder.prototype.init = function (config) {

	// PROPERTIES

	"use strict";

	// METHODS

	this.only = function (config) {
		// start an instance of the script
		return new this.Main(config, this).init();
	};

	this.each = function (config) {
		var _config, _context = this, instances = [];
		// for all element
		for (var a = 0, b = config.elements.length; a < b; a += 1) {
			// clone the configuration
			_config = Object.create(config);
			// insert the current element
			_config.element = config.elements[a];
			// start a new instance of the object
			instances[a] = new this.Main(_config, _context).init();
		}
		// return the instances
		return instances;
	};

	// EXECUTE SELF

	return (config.elements) ? this.each(config) : this.only(config);

};

// return as a require.js module
if (typeof module !== 'undefined') {
	exports = module.exports = useful.Photocylinder;
}
