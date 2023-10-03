import * as http from 'http';
import * as httpProxy from 'http-proxy';
import { JsonLog } from 'json-log';
import { argv } from 'yargs';

const log = new JsonLog('');
const match404 = /zzzbundles\/plugin\/canvas\/1.0.0\/canvas.chunk/;

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
  const { LISTEN_PORT, TARGET_URL, NO_SSL } = opts;

  const createServer = (
    req: http.IncomingMessage,
    res: http.ServerResponse
  ) => {
    const startMs = new Date().getTime();
    // Use regular expression matching to choose to proxy the request or return a 404
    if (req.url?.match(match404)) {
      console.log(`\n\n\n\nReturning 404 for request to ${req.url}`);
      // Return a 404
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    } else {
      // Proxy the request
      proxy?.web(req, res, { target: TARGET_URL });
    }

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

type InitFn = () => [httpProxy, http.Server];

