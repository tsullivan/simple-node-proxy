## simple-node-proxy
====================

### Quick Starting

Command to run the proxy server:
```
npm start -- --timeoutTime=2000 --listenPort=5620 --targetUrl=http://localhost:5660 --noSsl
```

The above example will add 2 seconds of response delay to requests that match the `const throttleCheck: ThrottleCheckFn` function check in `app/app.ts`.

To throttle every response, change the `ThrottleCheckFn` to simply return `true`.
