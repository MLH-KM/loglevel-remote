# loglevel-remote

> This is a plugin for the `loglevel` browser logger. It must be installed.

## Usage

### Create a logger and install the plugin

```js
// log.js
import * as log from 'loglevel';
import logLevelRemote from 'loglevel-remote';
import pkg from '../package.json';

const options = {
    // The server endpoint expecting the log submissions
    url: '/client-logs',
    // Client app version
    version: pkg.version,
    // Client app name
    client: pkg.name,
    // Set how often the logs should be sent to the server. (default: 10 seconds)
    interval: 15 * 1000
    // Set any headers here. Can be object or function
    headers: () => ({
        authToken: 'secret'
    })
};

logLevelRemote(log, options);

export default log;
```

### Elsewhere

```js
import log from './log';

// Log calls will be batched and sent to the server on the specified interval.
log.error('Something went wrong...');
```

## Contributing

Make your changes in `index.js` and then run `yarn build` to output the transpiled code to `built.js`.

Running `yarn release` will run the build script and then create a release.
