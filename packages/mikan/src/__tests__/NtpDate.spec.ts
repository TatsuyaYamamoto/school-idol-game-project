import NtpDate from "../NtpDate";
import { ErrorCode } from "../MikanError";

import * as fetch from "jest-fetch-mock";

// @ts-ignore
global.fetch = fetch;

describe("NtpDate class", () => {
  it("should throw MikanError when instantiate before syncing.", () => {
    try {
      new NtpDate();
      fail();
    } catch (e) {
      expect(e.code).toBe(ErrorCode.NTP_NOT_SYNCHRONIZED);
    }
  });

  it("should throw MikanError when getting now before syncing.", () => {
    try {
      NtpDate.now();
      fail();
    } catch (e) {
      expect(e.code).toBe(ErrorCode.NTP_NOT_SYNCHRONIZED);
    }
  });

  it("should return adjusted current unixtime after syncing.", async () => {
    const mockInitialTime_1st = 1541592275662;
    const mockReceiveTime_1st = 1541592275820;
    const mockInitialTime_2nd = 1541592275822;
    const mockReceiveTime_2nd = 1541592275988;

    // Mock fetch to connect NICT NTP web api
    fetch
      .once(
        JSON.stringify({
          id: "ntp-a1.nict.go.jp",
          it: mockInitialTime_1st / 1000,
          st: 1541592277.014,
          leap: 36,
          next: 1483228800,
          step: 1,
        })
      )
      .once(
        JSON.stringify({
          id: "ntp-b1.nict.go.jp",
          it: mockInitialTime_2nd / 1000,
          st: 1541592277.2,
          leap: 36,
          next: 1483228800,
          step: 1,
        })
      );
    // Mock current time
    Date.now = jest
      .fn()
      .mockReturnValueOnce(mockInitialTime_1st)
      .mockReturnValueOnce(mockReceiveTime_1st)
      .mockReturnValueOnce(mockInitialTime_2nd)
      .mockReturnValueOnce(mockReceiveTime_2nd);

    const { offset, maxLowerBound, minUpperBound } = await NtpDate.sync();

    console.log("offset", offset);
    console.log("maxLowerBound", maxLowerBound);
    console.log("minUpperBound", minUpperBound);

    expect(offset).toBe(-1282); // 1.282秒遅れている
    expect(maxLowerBound).toBe(-1368);
    expect(minUpperBound).toBe(-1196);

    const mockCurrentTime = 1541593718213;
    Date.now = jest.fn().mockReturnValueOnce(mockCurrentTime);

    const adjustedCurrentTime = NtpDate.now();
    expect(adjustedCurrentTime).toBe(mockCurrentTime + 1282);
  });

  it("faster should return adjusted current unixtime after syncing.", async () => {
    const mockInitialTime_1st = 1541638078825;
    const mockReceiveTime_1st = 1541638078973;
    const mockInitialTime_2nd = 1541638078973;
    const mockReceiveTime_2nd = 1541638079141;

    // Mock fetch to connect NICT NTP web api
    fetch
      .once(
        JSON.stringify({
          id: "ntp-a1.nict.go.jp",
          it: mockInitialTime_1st / 1000,
          st: 1541638077.571,
          leap: 36,
          next: 1483228800,
          step: 1,
        })
      )
      .once(
        JSON.stringify({
          id: "ntp-b1.nict.go.jp",
          it: mockInitialTime_2nd / 1000,
          st: 1541638077.743,
          leap: 36,
          next: 1483228800,
          step: 1,
        })
      );
    // Mock current time
    Date.now = jest
      .fn()
      .mockReturnValueOnce(mockInitialTime_1st)
      .mockReturnValueOnce(mockReceiveTime_1st)
      .mockReturnValueOnce(mockInitialTime_2nd)
      .mockReturnValueOnce(mockReceiveTime_2nd);

    const { offset, maxLowerBound, minUpperBound } = await NtpDate.sync();

    console.log("offset", offset);
    console.log("maxLowerBound", maxLowerBound);
    console.log("minUpperBound", minUpperBound);

    expect(offset).toBe(1326); // 1326秒進んでいる
    expect(maxLowerBound).toBe(1238);
    expect(minUpperBound).toBe(1414);

    const mockCurrentTime = 1541593718213;
    Date.now = jest.fn().mockReturnValueOnce(mockCurrentTime);

    const adjustedCurrentTime = NtpDate.now();
    expect(adjustedCurrentTime).toBe(mockCurrentTime - 1326);
  });
});
