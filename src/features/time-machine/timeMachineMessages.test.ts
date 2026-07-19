import { describe, expect, it } from 'vitest';
import { getTimeMachineMessages } from './timeMachineMessages';

describe('time-machine messages', () => {
  const messages = getTimeMachineMessages('zh-Hant');

  it('uses the concise device file hint', () => {
    expect(messages.picker.localOnlyHint).toBe('可以從本裝置的本地或雲端檔案中選擇');
  });

  it('summarizes the distance without repeating both dates', () => {
    expect(messages.story.confirm('2026/07/16', '2026/07/18', '2天'))
      .toBe('恩.....這兩個檔案看來相距了2天呢，確定要把這兩份檔案放進時光機嗎？');
    expect(messages.choices.confirmReady).toBe('沒錯！');
    expect(messages.choices.confirmWrong).toBe('拿錯了QQ');
  });

  it.each([
    ['zh-Hant', '2天', '恩.....這兩個檔案看來相距了2天呢，確定要把這兩份檔案放進時光機嗎？', '沒錯！', '拿錯了QQ'],
    ['zh-Hans', '2天', '嗯.....这两个档案看来相距了2天呢，确定要把这两份档案放进时光机吗？', '没错！', '拿错了QQ'],
    ['ja', '2日', 'うーん.....この二つのファイルは2日離れているみたい。時空機に入れても間違いない？', '間違いない！', '取り違えたQQ'],
    ['en', '2 days', 'Hmm.....these two files seem to be 2 days apart. Are you sure you want to put them into the time machine?', "That's right!", 'I grabbed the wrong files QQ'],
  ] as const)('keeps the confirmation intent aligned in %s', (locale, gap, copy, ready, wrong) => {
    const localizedMessages = getTimeMachineMessages(locale);

    expect(localizedMessages.story.confirm('older date', 'newer date', gap)).toBe(copy);
    expect(localizedMessages.choices.confirmReady).toBe(ready);
    expect(localizedMessages.choices.confirmWrong).toBe(wrong);
  });
});
