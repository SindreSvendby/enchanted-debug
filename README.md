#enchanted-debug

[![Coverage Status](https://coveralls.io/repos/github/SindreSvendby/enchanted-debug/badge.svg)](https://coveralls.io/github/SindreSvendby/enchanted-debug)
[![Dependency Status](https://dependencyci.com/github/SindreSvendby/enchanted-debug/badge)](https://dependencyci.com/github/SindreSvendby/enchanted-debug)
[ ![Codeship Status for SindreSvendby/enchanted-debug](https://app.codeship.com/projects/244cf160-b1cb-0134-df39-72b4409ab7af/status?branch=master)](https://app.codeship.com/projects/193272)

a wrapper around the amazing [debug package](https://www.npmjs.com/package/debug) that automaticly adds namespace based on the path and project root.

This module will be obsolete when [debug]() is in version 3, sjekk out this [github issue](https://github.com/visionmedia/debug/issues/370) for progress on that

## Cons
Performance is not the best, since we use callsite. So keep that in mind.

My intention is for use on server side. how this will work on the browser with minifiers and I haven't thought of

## Pros

Do not need to specify a namespace for each module. you only specify the project root folder,

This give the following benefits:

1. less work
2. lower chance of a copy/paste mistake.
3. follow [debug conventions](https://github.com/visionmedia/debug/#conventions) automatically.


## Prerequisite

enchanted-debug is a peerDependecy of `debug` and you can need to specified this your self

So install `debug`

`yarn add debug` / `npm install --save-exact debug`

## Installation

`yarn add enchanted-debug` or `npm install --save-exact enchanted-debug`

## Usage

```js
// assume this  file is under <project-root>/src/services/fetch/index.js
import eDebug from 'enchanted-debug'
// project root folder name, for this project
const { log, error } from eDebug('<project-root>')

log('starting')
error('failed')
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

const path =  '<project-root>:<subfolder>:<subfolder>:<subfolder>:<filename-without-ending>'
const subpath ='<subfolder>:<subfolder>:<subfolder>:<filename-without-ending>'
const log = debug(`${path}`);
const error = debug(`<project-root>:error:<project-path>`);

// use error or log, to log with the module
log('starting')
error('failed')
log('finished')
```

## Good to know

#### Skip filename ending:
```
enchanted-debug/src/services/fetch/utils.js =>  enchanted-debug:src:services:fetch:utils
```

#### Skip index as last part

```
enchanted-debug/src/services/fetch/index.js =>  enchanted-debug:src:services:fetch
```

#### Failure

`if (typeof callstack.length === 'number' && callstack.length > 1)`
if the above line for some reasons fails, the logging will
be done under

#### Dependencies

only have callsite as a dependency

## Credits
Created by the developers in [Aller Media](github.com/soldotno/)
