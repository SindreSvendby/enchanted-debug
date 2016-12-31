import debug from 'debug';
import stack from 'callsite';
import getPath from './get-path';

const regexDeleteFilending = /\..*?$/;
const regexFindForwardSlashes = /\//g;
const regexDeleteIndexFromFilePath = /\/index$/;

export default function enchantDebug(projectRootFolder = '') {
	let logInternal;
	let errorInternal;
	const callstack = stack();

	if (typeof callstack.length === 'number' && callstack.length > 1) {
		const callee = callstack[1];
		const modulePath = getPath(projectRootFolder, callee.getFileName());
		const debugNamespace = getNameSpace(modulePath);
		const subPath = getSubNamespace(projectRootFolder, debugNamespace);
		logInternal = debug(debugNamespace);
		errorInternal = debug(`${projectRootFolder}:error:${subPath}`);
		return {
			log: logInternal,
			error: errorInternal
		};
	}

	return {
		log: debug(`${projectRootFolder}:[unkown]`),
		error: debug(`${projectRootFolder}:error:[unkown]`)
	};
}

function getNameSpace(modulePath) {
	return modulePath
    .replace(regexDeleteFilending, '')
    .replace(regexDeleteIndexFromFilePath, '')
    .replace(regexFindForwardSlashes, ':');
}

function getSubNamespace(projectRootFolder, debugNamespace) {
	return debugNamespace.substr(projectRootFolder.length + 1);
}

export const testInternals = {
	getSubNamespace,
	getNameSpace
};
