/**
 * @see https://github.com/skyway/skyway-peer-authentication-samples/blob/master/README.jp.md
 */
interface Credential {
  authToken: string;
  ttl: number;
  timestamp: number;
}

export default Credential;
