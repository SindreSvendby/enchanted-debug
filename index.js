const path = require('path');
const stack = require('callsite');

const regexGrabModuleNameFromFilePath = /^.+(app|aurora-api)\/(.+)\.js?$/;
const regexDeleteIndexFromFilePath = /\/index$/;
const regexFindForwardSlashes = /\//g;

const findRoot = 'find-root';

const basePath = findRoot(__dirname);

// Define read-only globals

const auroraGlob = {
  basePath: path.dirname(require.main.filename),

  isDevEnv: process.env && process.env.NODE_ENV === 'development',
  isTestEnv: process.env && process.env.NODE_ENV === 'test',
  isProdEnv: process.env && process.env.NODE_ENV === 'production',

  createDebugChannel: () => {
    // Use the callsite module to get a stack trace from the V8 engine.
    // This enables us to find out from where this function was called,
    // which gives us the name of the originating module. This way, the
    // debug channel can be automatically created by having the same
    // call in every Aurora module that needs its own debug channel.
    const callstack = stack();

    if (typeof callstack.length === 'number' && callstack.length > 1) {
      const callerName = callstack[1]  // Fetch the first position that refers outside of here
      .getFileName()  // get the file name of the calling module
        .replace(regexGrabModuleNameFromFilePath, '$2')  // get module name
      .replace(regexDeleteIndexFromFilePath, '')  // remove 'index' from the end of the string
        .replace(regexFindForwardSlashes, ':');  // replace slashes with colons for 'debug' namespace

      return require('debug')(`api:${callerName}`);  // eslint-disable-line global-require
    }

    return require('debug')('api');  // eslint-disable-line global-require
  },
};

if (auroraGlob.isTestEnv) {
  auroraGlob.testResourcePath = 'test/resources/';
  auroraGlob.testResponsePath = 'test/responses/';
}

// This defines an 'aurora' object in the global namespace, which you can
// ask for several read-only flags and also some tool functions.
// The object is created in a way that prevents it from being altered.

Object.defineProperty(global, 'aurora', {
  value: Object.freeze(auroraGlob),
  configurable: false,
  enumerable: true,
  writable: false,
});
