import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        black: '#000000',
        'gray-dark': '#1a1a1a',
        'gray-medium': '#2d2d2d',
        'gray-light': '#e0e0e0',
        white: '#ffffff',
        accent: '#3b82f6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        'section': '4rem',
        'section-lg': '6rem',
      },
    },
  },
  plugins: [],
}
export default config

