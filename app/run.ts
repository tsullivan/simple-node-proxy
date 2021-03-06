import * as https from 'https';
import * as http from 'http';
import * as httpProxy from 'http-proxy';
import { IOpts } from './types';
import { Logger } from './app';

export function run(opts: IOpts, logger: Logger, cb: () => void): http.Server {
  const {
    TARGET_SSL,
    TARGET_URL,
    LISTEN_SSL,
    LISTEN_PORT,
    TIMEOUT_TIME,
    NO_SSL,
  } = opts;

  let proxy: httpProxy;
  let proxyServer: http.Server;

  if (NO_SSL) {
    proxy = httpProxy.createProxyServer({
      target: TARGET_URL,
      secure: false,
    });

    proxyServer = http.createServer((req, res) => {
      const startMs = new Date().getTime();
      setTimeout(() => {
        proxy.web(req, res, { target: TARGET_URL });

        res.on('finish', () => {
          const timeMs = new Date().getTime() - startMs;
          logger('request', req, res, { time_ms: timeMs });
        });
      }, TIMEOUT_TIME);
    });
  } else {
    proxy = httpProxy.createProxyServer({
      ssl: TARGET_SSL,
      target: TARGET_URL,
      secure: false,
    });

    proxyServer = https.createServer(LISTEN_SSL, (req, res) => {
      const startMs = new Date().getTime();
      setTimeout(() => {
        proxy.web(req, res, { target: TARGET_URL });

        res.on('finish', () => {
          const timeMs = new Date().getTime() - startMs;
          logger('request', req, res, { time_ms: timeMs });
        });
      }, TIMEOUT_TIME);
    });
  }

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
