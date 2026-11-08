/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#131313',
          container: '#1f2020',
          'container-high': '#2a2a2a',
          'container-highest': '#353535',
          'container-low': '#1b1c1c',
          'container-lowest': '#0e0e0e',
        },
        primary: {
          DEFAULT: '#ffb4a7',
          container: '#b20f03',
        },
        tertiary: {
          DEFAULT: '#00daf3',
          fixed: '#5cefff',
        },
        'on-surface': {
          DEFAULT: '#e4e2e1',
          variant: '#cac5c4',
        },
        outline: {
          DEFAULT: '#ac8983',
          variant: '#5c403b',
        },
        'on-tertiary': '#003640',
      },
      fontFamily: {
        headline: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        label: ['"Space Grotesk"', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      letterSpacing: {
        widest: '0.2em',
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
        pulse: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};
