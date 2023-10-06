## simple-node-proxy
====================

Get started:
```
~/simple-node-proxy main❯ while true; do npx ts-node index.ts --listenPort=5602 --targetUrl=http://0.0.0.0:5601 --timeoutTime=0 --noSsl ; done
{"level":3,"time":"2023-10-06T00:36:49.382Z","data":"{\"opts\":{\"LISTEN_PORT\":5602,\"TARGET_URL\":\"http://0.0.0.0:5601\",\"NO_SSL\":true}}","msg":"run options"}
{"level":3,"time":"2023-10-06T00:36:49.385Z","msg":"Listening on http://localhost:5602, proxying to http://0.0.0.0:5601"}
```
