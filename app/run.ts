import * as http from 'http';
import * as httpProxy from 'http-proxy';
import { argv } from 'yargs';
import { IOpts } from '../';
import { Logger } from './app';

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
export function run(logger: Logger, cb: (opts: IOpts) => void): http.Server | undefined {
  const { listenPort, targetUrl, timeoutTime, noSsl } = (argv as unknown) as {
    listenPort: string;
    timeoutTime: string;
    targetUrl: string;
    noSsl: boolean;
  };
  const opts: IOpts = {
    LISTEN_PORT: parseInt(listenPort, 10) || 9290,
    TARGET_URL: targetUrl,
    TIMEOUT_TIME: parseInt(timeoutTime, 10) || 0,
    NO_SSL: !!noSsl,
  };

  console.log(JSON.stringify({ opts }));

  const {
    LISTEN_PORT,
    TARGET_URL,
    NO_SSL,
  } = opts;

  const handleRequest: RequestHandler = (req, res, startMs) => (
  ) => {
    if (req?.url?.match(/bundles\/plugin\/lens.*\.chunk/)) {
      console.log('SPLAT');
      process.exit();
    }
    proxy?.web(req, res, { target: TARGET_URL });

    res.on('finish', () => {
      const timeMs = new Date().getTime() - startMs;
      logger('request', req, res, {
        time_ms: timeMs,
      });
    });
  };

  const createServer = (
    req: http.IncomingMessage,
    res: http.ServerResponse
  ) => {
    const startMs = new Date().getTime();
    const handler = handleRequest(req, res, startMs);
    handler();
  };

  const doNoSsl: InitFn = () => {
    const proxy = httpProxy.createProxyServer({
      target: TARGET_URL,
      secure: false,
    });
    const proxyServer = http.createServer(createServer);
    return [proxy, proxyServer];
  };

  const [proxy, proxyServer] = NO_SSL ? doNoSsl() : [];

  cb(opts);
  return proxyServer?.listen(LISTEN_PORT);
}
