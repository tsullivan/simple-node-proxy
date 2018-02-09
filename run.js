const https = require('https');
const httpProxy = require('http-proxy');

module.exports = function run(opts, reqLogger) {
  const { TARGET_SSL, TARGET_URL, LISTEN_SSL, LISTEN_PORT, TIMEOUT_TIME } = opts;

  const proxy = httpProxy.createProxyServer({
    ssl: TARGET_SSL,
    target: TARGET_URL,
    secure: false
  });

  const proxyServer = https.createServer(LISTEN_SSL, (req, res) => {
    reqLogger(req);

    setTimeout(() => {
      proxy.web(req, res, { target: TARGET_URL });
    }, TIMEOUT_TIME);
  });

  return proxyServer.listen(LISTEN_PORT);
};
