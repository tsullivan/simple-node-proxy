import { IncomingMessage, ServerResponse } from 'http';
import { JsonLog } from 'json-log';
import { opts } from '../opts';
import { run } from './run';

const log = new JsonLog('');
export type Logger = (
  type: string,
  req: IncomingMessage,
  res: ServerResponse,
  message: Record<string, string | number | Error>
) => void;

const logger: Logger = (type, req, res, message) => {
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
