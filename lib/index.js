'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.testInternals = undefined;
exports.default = enchantDebug;

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _callsite = require('callsite');

var _callsite2 = _interopRequireDefault(_callsite);

var _getPath = require('./get-path');

var _getPath2 = _interopRequireDefault(_getPath);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var regexDeleteFilending = /\..*?$/;
var regexFindForwardSlashes = /\//g;
var regexDeleteIndexFromFilePath = /\/index$/;

function enchantDebug() {
	var projectRootFolder = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

	var logInternal = void 0;
	var errorInternal = void 0;
	var callstack = (0, _callsite2.default)();

	if (typeof callstack.length === 'number' && callstack.length > 1) {
		var callee = callstack[1];
		var modulePath = (0, _getPath2.default)(projectRootFolder, callee.getFileName());
		var debugNamespace = getNameSpace(modulePath);
		var subPath = getSubNamespace(projectRootFolder, debugNamespace);
		logInternal = (0, _debug2.default)(debugNamespace);
		errorInternal = (0, _debug2.default)(projectRootFolder + ':error:' + subPath);
		return {
			log: logInternal,
			error: errorInternal
		};
	}

	return {
		log: (0, _debug2.default)(projectRootFolder + ':[unkown]'),
		error: (0, _debug2.default)(projectRootFolder + ':error:[unkown]')
	};
}

function getNameSpace(modulePath) {
	return modulePath.replace(regexDeleteFilending, '').replace(regexDeleteIndexFromFilePath, '').replace(regexFindForwardSlashes, ':');
}

function getSubNamespace(projectRootFolder, debugNamespace) {
	return debugNamespace.substr(projectRootFolder.length + 1);
}

var testInternals = exports.testInternals = {
	getSubNamespace: getSubNamespace,
	getNameSpace: getNameSpace
};