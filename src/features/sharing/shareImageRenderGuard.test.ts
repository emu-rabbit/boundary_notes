import { describe, expect, it, vi } from 'vitest';
import {
  hasVisibleShareImageTextProbe,
  requireRenderedShareImageText,
} from './shareImageRenderGuard';

describe('share image text render guard', () => {
  it('透明探針視為尚未產生任何字', () => {
    expect(hasVisibleShareImageTextProbe(new Uint8ClampedArray(16))).toBe(false);
  });

  it('探針出現任一非透明 glyph 像素才視為文字已完成', () => {
    const pixels = new Uint8ClampedArray(16);
    pixels[7] = 180;
    expect(hasVisibleShareImageTextProbe(pixels)).toBe(true);
  });

  it('首次仍是空白時會重畫，直到實際出現文字才接受結果', async () => {
    const renderAttempt = vi.fn()
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce('verified-canvas');
    const waitBetweenAttempts = vi.fn().mockResolvedValue(undefined);

    await expect(requireRenderedShareImageText(
      renderAttempt,
      waitBetweenAttempts,
    )).resolves.toBe('verified-canvas');
    expect(renderAttempt).toHaveBeenCalledTimes(2);
    expect(waitBetweenAttempts).toHaveBeenCalledTimes(1);
  });

  it('持續沒有文字時拒絕結果，不得繼續建立下載', async () => {
    const renderAttempt = vi.fn().mockResolvedValue(null);
    const waitBetweenAttempts = vi.fn().mockResolvedValue(undefined);

    await expect(requireRenderedShareImageText(
      renderAttempt,
      waitBetweenAttempts,
      3,
    )).rejects.toThrow('Share image text did not finish rendering.');
    expect(renderAttempt).toHaveBeenCalledTimes(3);
  });
});
