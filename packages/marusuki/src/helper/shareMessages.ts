/* eslint-disable yoda */

export const getShareMessage = (point: number): string => {
  let messageKey: 0 | 3 | 10 = 0;
  if (3 <= point) {
    messageKey = 3;
  }
  if (10 <= point) {
    messageKey = 10;
  }

  const messages = {
    0: `🐙「私まんまる好き...多分...たこやき${point}個ぐらい好き...。」`,
    3: `🐙「私まんまる好き〜♪たこやき${point}個ぐらい好き〜♪」`,
    10: `🐙「私まんまる好き〜♪かなり好き〜！たこやき好き！So、${point}個ぐらい好き〜♪」`,
  };

  return messages[messageKey];
};
