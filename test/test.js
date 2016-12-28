import test from 'ava';
import sinon from 'sinon';
import eDebug from '../src';
import debug from 'debug';

// const log = debug('enchanted-debug:actual');

test.before(t => {
	sinon.spy(debug, 'log');
});

test.beforeEach(t => {
	t.context.eDebug = eDebug();
});

// runs serial because I'm mocking out debug.log, not sure how make this local
test.serial.cb('Automaticly added path to debug', t => {
	const eLogger = t.context.eDebug;

	const observer = createTestObserver(() => {
		const message = debug.log.getCall(0).args[0];
  	const actual = message.split(' ')[6];

		t.is(actual, 'enchanted-debug:test:test');
		t.end();
	});

	eLogger.notifyOnInit(observer);
	eLogger.log('testing enchanted-debug');
});

test.cb('Message is passed true correctly ', t => {
	const eLogger = t.context.eDebug;

	const observer = createTestObserver(() => {
		const message = debug.log.getCall(0).args[0];
		const actual = message.split(' ').slice(7).join(' ');
		t.is(actual, 'testing enchanted-debug');
		t.end();
	});

	eLogger.notifyOnInit(observer);
	eLogger.log('testing enchanted-debug');
});

function createTestObserver(onNotify) {
	return {
		notify: onNotify
	};
}
