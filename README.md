## simple-node-proxy
====================

You need to create your own `opts.js` file. Mine looks like:

```javascript
const fs = require('fs');
const { argv } = require('yargs');

const TARGET_SSL = {
  key: fs.readFileSync('./conf/spicy.local/spicy.local-key.pem', 'utf8'),
  cert: fs.readFileSync('./conf/spicy.local/spicy.local-crt.pem', 'utf8')
};
const LISTEN_SSL = TARGET_SSL;

const { listenPort, targetUrl, timeoutTime } = argv;
const cmdOpts = {
  LISTEN_PORT: listenPort || 9290,
  TARGET_URL: targetUrl || 'https://spicy.local:9200',
  TIMEOUT_TIME: parseInt(timeoutTime, 10) || 0
};

console.log('options:', JSON.stringify({ // eslint-disable-line no-console
  listenPort: cmdOpts.LISTEN_PORT,
  targetUrl: cmdOpts.TARGET_URL,
  timeoutTime: cmdOpts.TIMEOUT_TIME
}));

module.exports = Object.assign({}, cmdOpts, {
  TARGET_SSL,
  LISTEN_SSL
});
```

Then I do `npm start -- --timeoutTime=333` to throttle the response from local ES to local Kibana by 333 ms.
