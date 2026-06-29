/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,ts}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"jf-openhuninn"',
          '"Noto Sans TC"',
          '"PingFang TC"',
          '"Microsoft JhengHei"',
          'system-ui',
          'sans-serif',
        ],
      },
      colors: {
        ink: {
          950: '#F6E8DF',
          900: '#E8CFC5',
          800: '#C9A8A0',
        },
        candle: '#B99055',
        paper: '#24141D',
        rose: '#7B3F51',
        moss: '#687560',
      },
      boxShadow: {
        candle: '0 0 48px rgba(185, 144, 85, 0.16)',
      },
    },
  },
  plugins: [],
};
