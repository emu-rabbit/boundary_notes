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
          950: '#070706',
          900: '#10100E',
          800: '#1B1A17',
        },
        candle: '#F2DFA8',
        paper: '#F8F1E1',
        rose: '#FFECEC',
        moss: '#9BAE93',
      },
      boxShadow: {
        candle: '0 0 48px rgba(242, 223, 168, 0.18)',
      },
    },
  },
  plugins: [],
};
