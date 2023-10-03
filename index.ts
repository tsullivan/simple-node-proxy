import * as http from 'http';
import * as httpProxy from 'http-proxy';
import { JsonLog } from 'json-log';
import { argv } from 'yargs';

interface IOpts {
  LISTEN_PORT: number;
  TIMEOUT_TIME: number;
  TARGET_URL: string;
  NO_SSL?: boolean;
  TARGET_SSL?: {
    key: string;
    cert: string;
  };
  LISTEN_SSL?: {
    key: string;
    cert: string;
  };
}

type RequestHandler = (
  req: http.IncomingMessage,
  res: http.ServerResponse,
  startMs: number
) => (isThrottle?: boolean) => void;

type InitFn = () => [httpProxy, http.Server];

const log = new JsonLog('');
function run(cb: (opts: IOpts) => void): http.Server | undefined {
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

  log.info('run options', JSON.stringify({ opts }));

  const {
    LISTEN_PORT,
    TARGET_URL,
    NO_SSL,
  } = opts;

  const handleRequest: RequestHandler = (req, res, startMs) => (
  ) => {
    if (req?.url?.match(/bundles\/plugin\/kibanaOverview.*\.chunk/)) {
      console.log('SPLAT');
      process.exit();
    }
    proxy?.web(req, res, { target: TARGET_URL });

    res.on('finish', () => {
      const timeMs = new Date().getTime() - startMs;
      log.info('request', {
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
        message: JSON.stringify({
          time_ms: timeMs,
        }),
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

run((opts: IOpts) => {
  let url: string;
  if (opts.NO_SSL) {
    url = `http://localhost:${opts.LISTEN_PORT}`;
  } else {
    url = `https://localhost:${opts.LISTEN_PORT}`;
  }
  log.info(`Listening on ${url}, proxying to ${opts.TARGET_URL}`);
});

