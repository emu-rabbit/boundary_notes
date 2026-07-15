declare module 'qrcode' {
  interface ToDataUrlOptions {
    color?: { dark?: string; light?: string };
    errorCorrectionLevel?: 'H' | 'L' | 'M' | 'Q';
    margin?: number;
    width?: number;
  }

  const QRCode: {
    toDataURL(text: string, options?: ToDataUrlOptions): Promise<string>;
  };

  export default QRCode;
}
