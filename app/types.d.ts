export interface IOpts {
  LISTEN_PORT: number;
  TIMEOUT_TIME: number;
  TARGET_URL: string;
  NO_SSL?: boolean;

  TARGET_SSL?: {
    key: string;
    cert: string;
  };

  LISTEN_SSL?: {
    key: string;
    cert: string;
  };
}
