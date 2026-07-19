export const shareImageRenderHeight = 1664;

export const shareImageTextProbeArea = {
  height: 64,
  width: 240,
  x: 0,
  y: 1600,
} as const;

export function hasVisibleShareImageTextProbe(pixels: Uint8ClampedArray): boolean {
  for (let index = 3; index < pixels.length; index += 4) {
    if (pixels[index] > 0) return true;
  }
  return false;
}
function waitForFontRasterization(): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, 75));
}

export async function requireRenderedShareImageText<T>(
  renderAttempt: () => Promise<T | null>,
  waitBetweenAttempts: () => Promise<void> = waitForFontRasterization,
  maximumAttempts = 4,
): Promise<T> {
  for (let attempt = 0; attempt < maximumAttempts; attempt += 1) {
    const rendered = await renderAttempt();
    if (rendered !== null) return rendered;
    if (attempt < maximumAttempts - 1) await waitBetweenAttempts();
  }

  throw new Error('Share image text did not finish rendering.');
}
