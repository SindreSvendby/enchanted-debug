import debug from 'debug';
import relativeFilepathFromModule from 'relative-filepath-from-module';
import stack from 'callsite';

const regexDeleteFilending = /\..*?$/;
const regexFindForwardSlashes = /\//g;
const regexDeleteIndexFromFilePath = /\/index$/;
const log = debug('enchanted-debug:index');

export default function enchantDebug() {
	const errorQ = [];
	const logQ = [];
	let logInternal;
	let errorInternal;
	const callstack = stack();
	const initObservers = [];

	if (typeof callstack.length === 'number' && callstack.length > 1) {
		const callee = callstack[1];
		const modulePath = relativeFilepathFromModule(callee.getFileName());
		modulePath
    .then(path => path.replace(regexDeleteFilending, ''))
    .then(path => path.replace(regexDeleteIndexFromFilePath, ''))
    .then(path => path.replace(regexFindForwardSlashes, ':'))
    .then(configureDebug)
		.catch(handleError);
	}

	return {
		log: logInternalWrapper,
		error: errorInternalWrapper,
		logLogger: logLogger,
		isLogEmpty,
		isErrorEmpty,
		notifyOnInit
	};

	function logInternalWrapper(message) {
		if (typeof logInternal === 'function') {
			logLogger(message);
		} else {
			logQ.push(message);
		}
	}

	function logLogger(message) {
		logInternal(message);
	}

	function errorLogger(message) {
		errorLogger(message);
	}

/**
 * Send in and obeserver, will be called with method 'notify' on complete
 */
	function notifyOnInit(observer) {
		initObservers.push(observer);
	}

	function errorInternalWrapper(message) {
		if (typeof errorInternal === 'function') {
			errorInternal(message);
		} else {
			errorQ.push(message);
		}
	}

	function isLogEmpty() {
		return logQ.length === 0;
	}

	function isErrorEmpty() {
		return errorQ.length === 0;
	}

	function handleError(err) {
		// log('handleError, error ', err);
		// debug('enchanted-debug:error')('Failed finding path to file, reason:', err);
		// TODO: should fetch stacktrace from message instead.
		logInternal = debug('[enchanted-debug failed]');
		errorInternal = debug('[enchanted-debug failed]:error');
		printDelayedQueue(logQ, logLogger);
		printDelayedQueue(errorQ, errorLogger);
		log(err);
		initObservers.forEach(observer => observer.notify());
	}

	function configureDebug(path) {
		// log('configureDebug, setting path', path);
		logInternal = debug(path);
		errorInternal = debug(`${path}:error`);
		printDelayedQueue(logQ, logLogger);
		printDelayedQueue(errorQ, errorLogger);
		initObservers.forEach(observer => {
			// log('Notifying observers');
			observer.notify();
		});
	}

	function printDelayedQueue(queue, logger) {
		// if (queue.length > 0) {
		// 	logger('[Delayed messages by enchanted-debug module - start]');
		// }
		queue.forEach(message => logger(message));
		// if (queue.length > 0) {
		// 	logger('[Delayed messages by enchanted-debug module - stop]');
		// }
	}

	function getTraceFunction() {
		return traceFunction || globalTraceFunction;
	}

	function getTraceLine() {
		return traceLine || globalTraceLine;
	}
}
