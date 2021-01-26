import { run } from './run';
import { JsonLog } from 'json-log';
import { opts } from '../opts';

const log = new JsonLog('simple-node-proxy');
const logger = (type, req, res, message) => {
  log.info(type, {
    method: req.method,
    url: req.url,
    statusCode: res.statusCode,
    message,
  });
};

run(opts, logger, () => {
  log.info(`Listening on ${opts.LISTEN_PORT}, proxying to ${opts.TARGET_URL}`);
});
