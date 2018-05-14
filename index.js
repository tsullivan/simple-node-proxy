const log = require('json-log');
const run = require('./run');
const opts = require('./opts');

const logger = (req, res) => {
  log(`${req.method} ${req.url} - ${res.statusCode}`);
  log('request', {
    method: req.method,
    url: req.url,
    statusCode: res.statusCode
  });
};

run(opts, logger);
log(`Listening on ${opts.LISTEN_PORT}, proxying to ${opts.TARGET_URL}`);
