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
		workers: {
			initial: 1,
			regular: 1
		}
	};
};
