import { run } from './run';
import { JsonLog } from 'json-log';
import { opts } from '../opts';

const log = new JsonLog('');
const logger = (
  type: string,
  req: { method: any; url: any },
  res: { statusCode: any },
  message: any
) => {
  log.info(type, {
    method: req.method,
    url: req.url,
    statusCode: res.statusCode,
    message,
  });
};

run(opts, logger, () => {
  let url: string;
  if (opts.NO_SSL) {
    url = `http://localhost:${opts.LISTEN_PORT}`;
  } else {
    url = `https://localhost:${opts.LISTEN_PORT}`;
  }
  log.info(`Listening on ${url}, proxying to ${opts.TARGET_URL}`);
});
