const run = require('./run');
const opts = require('./opts');

const log = message => console.log(message); //eslint-disable-line no-console
const reqLogger = req => log(`${req.method} ${req.url}`);

run(opts, reqLogger);
log(`Listening on ${opts.LISTEN_PORT}, proxying to ${opts.TARGET_URL}`);
