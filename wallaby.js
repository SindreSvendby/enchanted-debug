module.exports = function (wallaby) {
	// Need to set this variable to get
	process.env.DEBUG = '*,-ava,-babel';

	return {
		files: [
			'src/**/*.js'
		],

		tests: [
			'test/**/*.js'
		],

		env: {
			type: 'node',
			runner: 'node',
			params: {
				env: 'DEBUG=*,-ava,-babel'
			}
		},

		compilers: {
			'**/*.js': wallaby.compilers.babel()
		},

		testFramework: 'ava',
		debug: true,
		workers: {recycle: true},
		setup: w => {
			if (!global._callsiteReplaced) {
				const Module = require('module').Module;
				const modulePrototype = Module.prototype;
				const originalRequire = modulePrototype.require;
				modulePrototype.require = function (filePath) {
					if (filePath === 'callsite') {
						return () => {
							const result = originalRequire.call(this, filePath)();
							result.shift();
							console.log(result.map(r => r.getFileName()));
							const fileName = result[1].getFileName()
								.replace(w.projectCacheDir, 'enchanted-debug');
							result[1] = {getFileName: () => fileName};
							return result;
						};
					}
					return originalRequire.call(this, filePath);
				};
				global._callsiteReplaced = true;
			}
		}
	};
};
