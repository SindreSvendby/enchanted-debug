"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = getPath;
function getPath(rootName, filePath) {
	var indexOf = filePath.indexOf(rootName, filePath);
	return filePath.substr(indexOf, Infinity);
}