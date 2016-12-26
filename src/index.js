import * as debugModule from 'debug';
import relativeFilepathFromModule from 'relative-filepath-from-module';
import stack from 'callsite';

const regexDeleteFilending = /\..*?$/;
const regexFindForwardSlashes = /\//g;
const regexDeleteIndexFromFilePath = /\/index$/;

let globalTraceFunction = true;
let globalTraceLine = true;
let debug = debugModule;

export function setTraceLine(bool) {
  globalTraceLine = bool;
}

export function setTraceFunction(bool) {
  globalTraceFunction = bool;
}

export function setDebug(newDebug) {
  debug = newDebug;
}


export default function enchantDebug({ traceFunction, traceLine } = {}) {
  function getTraceFunction() {
    return traceFunction || globalTraceFunction;
  }

  function getTraceLine() {
    return traceLine || globalTraceLine;
  }
  const errorQ = [];
  const logQ = [];
  let logInternal;
  let errorInternal;
  const callstack = stack();

  if (typeof callstack.length === 'number' && callstack.length > 1) {
    const callee = callstack[1];
    const modulePath = relativeFilepathFromModule(callee.getFileName());
    modulePath
    .then(path => path.replace(regexDeleteFilending, ''))
    .then(path => path.replace(regexDeleteIndexFromFilePath, ''))
    .then(path => path.replace(regexFindForwardSlashes, ':'))
    .then((path) => {
      logInternal = debug(path);
      errorInternal = debug(`${path}:error`);
      // TODO: should some extra info about the delay be added?
      logQ.forEach(message => logInternal(`[Delayed by enchanted-debug module] ${message}`));
      errorQ.forEach(message => errorInternal(`[Delayed by enchanted-debug module] ${message}`));
    })
    .catch((err) => {
      // TODO: should fetch stacktrace from message instead.
      logInternal = debug('???');
      errorInternal = debug('???:error');
      debug('aurora-debug:error')('Failed finding path to file, reason', err);
      // TODO: should some extra info about the delay be added?
      logQ.forEach(message => logInternal(message));
      errorQ.forEach(message => errorInternal(message));
    });
  }

  return {
    log: function logWrapper(message) {
      if (typeof logInternal === 'function') {
        logInternal(message);
      } else {
        logQ.push(message);
      }
    },
    error: function errorWrapper(message) {
      if (typeof errorInternal === 'function') {
        errorInternal(message);
      } else {
        errorQ.push(message);
      }
    },
  };
}
