import { run } from './run';
import * as log from 'json-log';
import * as opts from '../opts';

const logger = (type, req, res, message) => {
  log(type, {
    method: req.method,
    url: req.url,
    statusCode: res.statusCode,
    message,
  });
};

run(opts, logger, () => {
  log(`Listening on ${opts.LISTEN_PORT}, proxying to ${opts.TARGET_URL}`);
});
