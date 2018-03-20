const run = require('./run');
const opts = require('./opts');

const log = message => console.log(message); //eslint-disable-line no-console
const logger = (req, res) => {
  log(`${req.method} ${req.url} - ${res.statusCode}`);
};

run(opts, logger);
log(`Listening on ${opts.LISTEN_PORT}, proxying to ${opts.TARGET_URL}`);
