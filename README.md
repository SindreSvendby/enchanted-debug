#Enchanted Debug


a wrapper around the amazing (debug package)[https://www.npmjs.com/package/debug] that follow what we think is best practises

## cons
1. Performance is not the best, since we use callsite

## Pros
1. Do not need to


## Prerequisite

Debug is a peerDependecy of `aurora-debug` and you can need to specified this your self

So install `debug` => ( `yarn add debug` / `npm install --save-exact debug` )

## Installation

Install this package: `yarn add aurora-debug` or `npm install --save-exact aurora-debug`

## Usage

```
import { log, error } from 'aurora-debug'


```

This would be the same as doing this with plain debug:
```
import debug from 'debug';

const path = '<project-root>:<subfolder>:<subfolder>:<subfolder>:<filename-without-ending>'
const log = debug(`${path}`);
const error = debug(`${path}:error`);

function logHelloWorld(skipHelloWorld = false) {
  log('Starting helloWorld');
  if (skipHelloWorld) error('We are skipping logging of helloWorld, thats kind of strange?');
  else log('Hello World!');
  log('Finished helloWorld');
}

logHelloWorld();
logHelloWorld(true);



```




## Credits
Created by the developers in (Aller Media)[github.com/soldotno/]
