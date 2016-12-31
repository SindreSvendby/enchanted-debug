import debug from 'debug';
import test, {beforeEach, afterEach} from 'ava';
import sinon from 'sinon';

import enchantDebug, {testInternals} from '../src';

beforeEach(() => {
	sinon.spy(debug, 'log');
});

afterEach(() => {
	debug.log.restore();
});

test.serial('eDebug - log', t => {
	// sinon.spy(debug, 'log');
	const {log} = enchantDebug('enchanted-debug');
	log('testing-log');
	const callee = debug.log.getCall(0).args[0];
	const debugNamespace = callee.split(' ')[6];
	const message = callee.split(' ')[7];
	t.is(debugNamespace, 'enchanted-debug:test');
	t.is(message, 'testing-log');
});

test.serial('eDebug - error', t => {
	const {error} = enchantDebug('enchanted-debug');
	error('error-log');
	const callee = debug.log.getCall(0).args[0];
	const debugNamespace = callee.split(' ')[6];
	const message = callee.split(' ')[7];
	t.is(debugNamespace, 'enchanted-debug:error:test');
	t.is(message, 'error-log');
});

test.serial('eDebug - two usages in one package', t => {
	const {log} = enchantDebug('test');
	log('note-tested-string');
	const callee = debug.log.getCall(0).args[0];
	const debugNamespace = callee.split(' ')[6];
	t.is(debugNamespace, 'test');
});

// Internal functions test
test.serial('getSubNamespace', t => {
	const rootName = 'enchanted-debug';
	const filePath = 'enchanted-debug:src:service:filename';
	const path = testInternals.getSubNamespace(rootName, filePath);

	t.is('src:service:filename', path);
});

test.serial('getNameSpace - switch to :', t => {
	const filePath = 'enchanted-debug/service';
	const path = testInternals.getNameSpace(filePath);
	t.is('enchanted-debug:service', path);
});

test.serial('getNameSpace - remove fileending', t => {
	const filePath = 'enchanted-debug/src/service/filename.js';
	const path = testInternals.getNameSpace(filePath);
	t.is('enchanted-debug:src:service:filename', path);
});

test.serial('getNameSpace - remove index', t => {
	const filePath = 'enchanted-debug/src/service/index';
	const path = testInternals.getNameSpace(filePath);
	t.is('enchanted-debug:src:service', path);
});
