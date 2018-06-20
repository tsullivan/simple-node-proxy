export interface IOpts {
  LISTEN_PORT: string;
  TIMEOUT_TIME: string;
  TARGET_URL: string;
  TARGET_SSL: {
    key: string;
    cert: string;
  };
  LISTEN_SSL: {
    key: string;
    cert: string;
  };
}
