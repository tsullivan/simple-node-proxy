## simple-node-proxy
====================

You need to create your own `opts.js` file. Mine looks like:

  ```javascript
  const fs = require('fs');

  const TARGET_SSL = {
    key: fs.readFileSync('./conf/local-key.pem', 'utf8'), // had a .key file, renamed it to .pem
    cert: fs.readFileSync('./conf/local-crt.pem', 'utf8') // had a .crt file, renamed it to .pem
  };

  const TARGET_URL = 'https://localhost:9200';

  const LISTEN_PORT = 9290;
  const LISTEN_SSL = TARGET_SSL;

  const TIMEOUT_TIME = 3 * 1000; // 3 seconds

  module.exports = {
    TARGET_SSL,
    TARGET_URL,
    LISTEN_SSL,
    LISTEN_PORT,
    TIMEOUT_TIME
  };
  ```
