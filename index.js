/*eslint-disable no-console*/
const fs = require('fs');
const https = require('https');
const httpProxy = require('http-proxy');

const LISTEN_PORT = 9290;
const TARGET_URL = 'https://spicy.local:9200';
const TIMEOUT_TIME = 3 * 1000; // 3 seconds

const sslOpts = {
  key: fs.readFileSync('./conf/spicy.local/spicy.local-key.pem', 'utf8'),
  cert: fs.readFileSync('./conf/spicy.local/spicy.local-crt.pem', 'utf8')
};

const proxy = httpProxy.createProxyServer({
  ssl: sslOpts,
  target: TARGET_URL,
  secure: false
});

const proxyServer = https.createServer(sslOpts, (req, res) => {
  console.log(`${req.method} ${req.url}`);

  setTimeout(() => {
    proxy.web(req, res, { target: TARGET_URL });
  }, TIMEOUT_TIME);
});

proxyServer.listen(LISTEN_PORT);

console.log(`Listening on ${LISTEN_PORT}, proxying to ${TARGET_URL}`);
