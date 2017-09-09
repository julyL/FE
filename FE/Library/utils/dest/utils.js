(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.utils = factory());
}(this, (function () { 'use strict';

// import * as Date from "./src/Date/index.js";
// import {Date} from "./src/Date/index.js";

var utils;
utils = Object.assign({}, Date);

var utils$1 = utils;

return utils$1;

})));
