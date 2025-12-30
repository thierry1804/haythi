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
        primary: '#2563eb',
        'primary-dark': '#1d4ed8',
        'page-bg': '#ffffff',
        'page-bg-alt': '#f8fafc',
        title: '#0f172a',
        body: '#475569',
        'border-color': '#e2e8f0',
        'card-bg': '#ffffff',
        'dark-section': '#0f172a',
        'dark-border': '#1e293b',
        // Keep old colors for backward compatibility
        black: '#000000',
        'gray-dark': '#1a1a1a',
        'gray-medium': '#2d2d2d',
        'gray-light': '#e0e0e0',
        white: '#ffffff',
        accent: '#2563eb',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Space Grotesk', 'sans-serif'],
        body: ['var(--font-body)', 'Noto Sans', 'sans-serif'],
        sans: ['var(--font-body)', 'Noto Sans', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
        full: '9999px',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
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

