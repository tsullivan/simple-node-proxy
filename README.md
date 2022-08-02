## simple-node-proxy
====================

### Quick Starting

Command to run the proxy server:
```
npm start -- --timeoutTime=2000 --listenPort=5620 --targetUrl=http://localhost:5660 --noSsl
```

The above example will add 2 seconds of response delay to requests that match the `const throttleCheck: ThrottleCheckFn` function check in `app/app.ts`.

To throttle every response, change the `ThrottleCheckFn` to simply return `true`.

### Running the proxy with SSL

Add the following code in a file called `ssl.ts`:
```javascript
const fs = require('fs');

const TARGET_SSL = {
  key: fs.readFileSync('./certs/key.pem', 'utf8'),
  cert: fs.readFileSync('./certs/crt.pem', 'utf8')
};
const LISTEN_SSL = TARGET_SSL; // this uses the same certificate for listening and forwarding
```

Then import `ssl.ts` from `app/run.ts` and add TARGET_SSL and LISTEN_SSL to the `const opts: IOpts` variable in app/run.ts. When starting the proxy server, do not add the `--noSsl` flag to the start command.
