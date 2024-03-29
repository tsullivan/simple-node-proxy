import * as http from 'http';
import * as httpProxy from 'http-proxy';
import { JsonLog } from 'json-log';
import { argv } from 'yargs';
import { IOpts } from '../types';

const SLOW_TIME = 5000; // in ms
const makeItSlow = (url: string | undefined) =>
  url &&
  (url.match(/test-data\S*\/\S*_search/) !== null ||
    url.match(/^\/_search/) !== null);

const runNoSsl = ({
  TARGET_URL,
  LISTEN_PORT,
}: {
  TARGET_URL: string;
  LISTEN_PORT: number;
}) => {
  const log = new JsonLog('"logger":"runNoSsl",');
  const proxy = httpProxy.createProxyServer({
    target: TARGET_URL,
    secure: false,
  });
  const proxyServer = http.createServer(
    (req: http.IncomingMessage, res: http.ServerResponse) => {
      const startMs = new Date().getTime();

      if (makeItSlow(req.url)) {
        console.log(`\n\n\n\nMaking it slow for request to ${req.url}`);
        setTimeout(() => {
          // Proxy the request
          proxy?.web(req, res, { target: TARGET_URL });
        }, SLOW_TIME);
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
    }
  );
  proxyServer?.listen(LISTEN_PORT);
};

function run() {
  const log = new JsonLog('run');
  const { listenPort, targetUrl, noSsl } = (argv as unknown) as {
    listenPort: string;
    targetUrl: string;
    noSsl: boolean;
  };
  const opts: IOpts = {
    LISTEN_PORT: parseInt(listenPort, 10) || 9290,
    TARGET_URL: targetUrl,
    NO_SSL: Boolean(noSsl),
  };
  const { LISTEN_PORT, TARGET_URL } = opts;

  log.info('run options', JSON.stringify({ opts }));

  // only no ssl works
  if (opts.NO_SSL) {
    runNoSsl({ TARGET_URL, LISTEN_PORT });
  }

  return opts;
}

const finalOpts = run();
const url = `http://localhost:${finalOpts.LISTEN_PORT}`;
const mainLog = new JsonLog('main');
mainLog.info(`Listening on ${url}, proxying to ${finalOpts.TARGET_URL}`);
