import test from 'ava';
import getPath from '../src/get-path';

test('getPath', t => {
	const rootName = 'enchanted-debug';
	const filePath = '/home/user/git/enchanted-debug/src/service/filename.js';
	const path = getPath(rootName, filePath);

	t.is('enchanted-debug/src/service/filename.js', path);
});
