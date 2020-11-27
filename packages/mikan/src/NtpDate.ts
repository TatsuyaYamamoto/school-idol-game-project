import MikanError, { ErrorCode } from "./MikanError";
import { getLogger } from "./logger";

/**
 * @see http://www.nict.go.jp/JST/http.html
 */
interface NictNtpData {
  /**
   * サーバID
   */
  id: string;
  /**
   * 発信時刻（クライアントから送信された時刻）
   */
  it: number;
  /**
   * サーバ時刻
   */
  st: number;
  /**
   *  next 以前の時点での UTC と TAI の差（秒）
   */
  leap: number;
  /**
   * 次、または最後のうるう秒イベント時刻
   */
  next: number;
  /**
   * 次、または最後のうるう秒イベントが挿入の場合 1、削除の場合 -1
   */
  step: number;
}

interface EstimatedJstData {
  initialTime: number;
  sendTime: number;
  receiveTime: number;
  roundTripTime: number;
  estimatedClockDifference: number;
  estimatedLowerBound: number;
  estimatedUpperBound: number;
}

interface SynchronizedData {
  offset: number;
  maxLowerBound: number;
  minUpperBound: number;
}

const NICT_JSON_NTP_SERVER_URLS = [
  "https://ntp-a1.nict.go.jp/cgi-bin/json",
  "https://ntp-b1.nict.go.jp/cgi-bin/json",
];

const logger = getLogger("mikan:ntp-date");

class NtpDate {
  private static _synchronizedData: SynchronizedData | null = null;

  private _adjustedDate: Date;

  public constructor(value?: number | string | Date) {
    const defaultDate = value ? new Date(value) : new Date();
    this._adjustedDate = new Date(NtpDate.adjust(defaultDate.getTime()));
  }

  public static get synchronizedData(): SynchronizedData {
    // eslint-disable-next-line no-underscore-dangle
    if (!NtpDate._synchronizedData) {
      throw new MikanError(ErrorCode.NTP_NOT_SYNCHRONIZED);
    }

    // eslint-disable-next-line no-underscore-dangle
    return NtpDate._synchronizedData;
  }

  public static async sync(): Promise<SynchronizedData> {
    const receivedJstDataList: EstimatedJstData[] = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const baseUrl of NICT_JSON_NTP_SERVER_URLS) {
      const url = `${baseUrl}?${Date.now() / 1000}`;

      // eslint-disable-next-line no-await-in-loop
      const res = await fetch(url);
      const receiveTime = Date.now();
      // eslint-disable-next-line no-await-in-loop
      const nictNtpData: NictNtpData = await res.json();
      const initialTime = nictNtpData.it * 1000;
      const sendTime = nictNtpData.st * 1000;

      receivedJstDataList.push({
        initialTime,
        sendTime,
        receiveTime,
        roundTripTime: receiveTime - initialTime,
        estimatedClockDifference: sendTime - (initialTime + receiveTime) / 2,
        estimatedLowerBound: initialTime - sendTime - 16,
        estimatedUpperBound: receiveTime - sendTime + 16,
      });
    }

    const maxLowerBound = Math.max(
      ...receivedJstDataList.map((data) => data.estimatedLowerBound)
    );
    const minUpperBound = Math.min(
      ...receivedJstDataList.map((data) => data.estimatedUpperBound)
    );
    const offset = (maxLowerBound + minUpperBound) / 2;

    const clockStateMessage =
      // eslint-disable-next-line no-nested-ternary
      offset === 0
        ? `correct`
        : offset > 0
        ? `${offset}ms faster`
        : `${offset}ms slower`;
    logger.debug(
      `sync to nict ntp server. this client's clock is ${clockStateMessage}.`
    );

    this._synchronizedData = {
      offset,
      maxLowerBound,
      minUpperBound,
    };

    return this._synchronizedData;
  }

  /**
   * {@link SynchronizedData}によって時刻調整した現在のunixTimeを返す
   */
  public static now(): number {
    // 0 < offset の場合、Clientは標準時よりoffset[ms]進んでいるということ
    // offsetを減算することで、時間を遅らせる
    return NtpDate.adjust(Date.now());
  }

  public getTime(): number {
    return this._adjustedDate.getTime();
  }

  public toString(): string {
    return this._adjustedDate.toString();
  }

  /**
   *
   *
   * 0 < offset の場合、Clientは標準時よりoffset[ms]進んでいるということ
   * offsetを減算することで、時間を遅らせる
   * @param clientClockTime
   */
  private static adjust(clientClockTime: number): number {
    return clientClockTime - NtpDate.synchronizedData.offset;
  }
}

export default NtpDate;
