const https = require('https');
const httpProxy = require('http-proxy');

module.exports = function run(opts, logger) {
  const { TARGET_SSL, TARGET_URL, LISTEN_SSL, LISTEN_PORT, TIMEOUT_TIME } = opts;

  const proxy = httpProxy.createProxyServer({
    ssl: TARGET_SSL,
    target: TARGET_URL,
    secure: false
  });

  const proxyServer = https.createServer(LISTEN_SSL, (req, res) => {
    let startMs = new Date().getTime();
    setTimeout(() => {
      proxy.web(req, res, { target: TARGET_URL });

      res.on('finish', () => {
        const timeMs = new Date().getTime() - startMs;
        logger('request', req, res, { time_ms: timeMs });
      });
    }, TIMEOUT_TIME);
  });

  // Listen for the `error` event on `proxy`.
  proxy.on('error', (err, req, res) => {
    res.writeHead(500, {
      'Content-Type': 'text/plain'
    });

    logger('error', req, res, { error: err });
    res.end(`Something went wrong from the otherwise awesome proxy: ${err.message}`);
  });

  return proxyServer.listen(LISTEN_PORT);
};
