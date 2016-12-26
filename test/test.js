import enchantDebug from '../src';

const { log, error } = enchantDebug();

function logHelloWorld(skipHelloWorld = false) {
  log('Starting helloWorld');
  if (skipHelloWorld) error('We are skipping logging of helloWorld, thats kind of strange?');
  else log('Hello World!');
  log('Finished helloWorld');
  setTimeout(() => log('Finished helloWorld'), 100);
}

logHelloWorld();
logHelloWorld(true);
