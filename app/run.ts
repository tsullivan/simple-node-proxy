import * as https from 'https';
import * as http from 'http';
import * as httpProxy from 'http-proxy';
import { IOpts } from './types';
import { Logger, throttleCheck } from './app';

export type ThrottleCheckFn = (req?: http.IncomingMessage) => boolean;

/**
 *
 * local types
 */
type InitFn = () => [httpProxy, http.Server];

type RequestHandler = (
  req: http.IncomingMessage,
  res: http.ServerResponse,
  startMs: number
) => (isThrottle?: boolean) => void;

/**
 *
 * export
 */
export function run(opts: IOpts, logger: Logger, cb: () => void): http.Server {
  const {
    TARGET_SSL,
    TARGET_URL,
    LISTEN_SSL,
    LISTEN_PORT,
    TIMEOUT_TIME,
    NO_SSL,
  } = opts;

  const handleRequest: RequestHandler = (req, res, startMs) => (isThrottle?: boolean) => {
    proxy.web(req, res, { target: TARGET_URL });

    res.on('finish', () => {
      const timeMs = new Date().getTime() - startMs;
      logger(isThrottle ? 'THROTTLED request' : 'request', req, res, { time_ms: timeMs });
    });
  };

  const createServer = (req: http.IncomingMessage, res: http.ServerResponse) => {
    const startMs = new Date().getTime();
    const handler = handleRequest(req, res, startMs);

    const isThrottle = throttleCheck(req);
    if (isThrottle) {
      setTimeout(() => handler(isThrottle), TIMEOUT_TIME); // delay the ES data
    } else {
      handler();
    }
  };

  const doNoSsl: InitFn = () => {
    const proxy = httpProxy.createProxyServer({
      target: TARGET_URL,
      secure: false,
    });
    const proxyServer = http.createServer(createServer);
    return [proxy, proxyServer];
  };

  const doSsl: InitFn = () => {
    const proxy = httpProxy.createProxyServer({
      ssl: TARGET_SSL,
      target: TARGET_URL,
      secure: false,
    });
    const proxyServer = https.createServer(LISTEN_SSL, createServer);
    return [proxy, proxyServer];
  };

  const [proxy, proxyServer] = NO_SSL ? doNoSsl() : doSsl();

  // Listen for the `error` event on `proxy`.
  proxy.on('error', (err, req, res) => {
    res.writeHead(500, {
      'Content-Type': 'text/plain',
    });

    logger('error', req, res, { error: err });
    res.end(
      `Something went wrong from the otherwise awesome proxy: ${err.message}`
    );
  });

  cb();
  return proxyServer.listen(LISTEN_PORT);
}
