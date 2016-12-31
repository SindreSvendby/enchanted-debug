#enchanted-debug


a wrapper around the amazing [debug package](https://www.npmjs.com/package/debug) that follow what we think is best practises
(this is while debug has not been released version 3, in version 3 they are adding middleware)

## cons
1. Performance is not the best, since we use callsite

## Pros
1. Do not need to


## Prerequisite

enchanted-debug is a peerDependecy of `debug` and you can need to specified this your self

So install `debug`

`yarn add debug` / `npm install --save-exact debug`

## Installation

`yarn add aurora-debug` or `npm install --save-exact aurora-debug`

## Usage

```js
// assume this  file is under <project-root>/src/services/fetch/index.js
import eDebug from 'enchanted-debug'
// project root folder name, for this project
const { log, error } from eDebug('<project-root>')

log('starting')
errror('failed')
log('finished')

```

Output from debug module will be
```
// output will be:
<project-root>:src:services:fetch starting
<project-root>:error:src:services:fetch: failed
<project-root>:src:services:fetch finished
```

This would be the same as doing this with plain debug:
```js
import debug from 'debug';

const path = '<project-root>:<subfolder>:<subfolder>:<subfolder>:<filename-without-ending>'
const log = debug(`${path}`);
const error = debug(`${path}:error`);

log()
```

## Good to know

skip ending:
enchanted-debug/src/services/fetch/utils.js =>  enchanted-debug:src:services:fetch:utils

skip index from last file
enchanted-debug/src/services/fetch/index.js =>  enchanted-debug:src:services:fetch



## Credits
Created by the developers in (Aller Media)[github.com/soldotno/]
