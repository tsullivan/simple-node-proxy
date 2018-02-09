/*eslint-disable no-console*/
const http = require('http');
const httpProxy = require('http-proxy');

// Create a proxy server with latency
const proxy = httpProxy.createProxyServer();

const LISTEN_PORT = 9260;
const TARGET_URL = 'http://localhost:9200';
const TIMEOUT_TIME = 5 * 1000; // 5 seconds

// A server that makes an operation that waits a while and then proxies the request
http
  .createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);

    // This simulates an operation that takes longer to execute
    setTimeout(() => {
      proxy.web(req, res, { target: TARGET_URL });
    }, TIMEOUT_TIME);
  })
  .listen(LISTEN_PORT);

console.log(`Listening on ${LISTEN_PORT}, proxying to ${TARGET_URL}`);
