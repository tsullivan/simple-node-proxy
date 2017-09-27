const http = require('http'),
    httpProxy = require('http-proxy');

// Create a proxy server with latency
const proxy = httpProxy.createProxyServer();

const LISTEN_PORT = 9260;
const TARGET_URL = 'http://localhost:9210';

// A server that makes an operation that waits a while and then proxies the request
http.createServer((req, res) => {
  // This simulates an operation that takes 500ms to execute
  setTimeout(() => {
    proxy.web(req, res, { target: TARGET_URL });
  }, 1500);
}).listen(LISTEN_PORT);

console.log(`Listening on ${LISTEN_PORT}, proxying to ${TARGET_URL}`);
