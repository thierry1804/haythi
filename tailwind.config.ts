import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Material Design 3 - Cyber Obsidian Palette
        'surface': '#131313',
        'surface-dim': '#131313',
        'surface-bright': '#393939',
        'surface-container-lowest': '#0e0e0e',
        'surface-container-low': '#1b1c1c',
        'surface-container': '#1f2020',
        'surface-container-high': '#2a2a2a',
        'surface-container-highest': '#353535',
        'surface-variant': '#353535',
        'surface-tint': '#ffb4a7',
        'on-surface': '#e4e2e1',
        'on-surface-variant': '#e5beb7',
        'on-background': '#e4e2e1',
        'background': '#131313',

        'primary': '#ffb4a7',
        'primary-container': '#b20f03',
        'primary-fixed': '#ffdad4',
        'primary-fixed-dim': '#ffb4a7',
        'on-primary': '#680300',
        'on-primary-container': '#ffc0b6',
        'on-primary-fixed': '#400100',
        'on-primary-fixed-variant': '#920600',
        'inverse-primary': '#bb1809',

        'secondary': '#c8c6c6',
        'secondary-container': '#474747',
        'secondary-fixed': '#e4e2e1',
        'secondary-fixed-dim': '#c8c6c6',
        'on-secondary': '#303030',
        'on-secondary-container': '#b6b5b4',
        'on-secondary-fixed': '#1b1c1c',
        'on-secondary-fixed-variant': '#474747',

        'tertiary': '#00daf3',
        'tertiary-container': '#00626e',
        'tertiary-fixed': '#9cf0ff',
        'tertiary-fixed-dim': '#00daf3',
        'on-tertiary': '#00363d',
        'on-tertiary-container': '#00e4fe',
        'on-tertiary-fixed': '#001f24',
        'on-tertiary-fixed-variant': '#004f58',

        'error': '#ffb4ab',
        'error-container': '#93000a',
        'on-error': '#690005',
        'on-error-container': '#ffdad6',

        'outline': '#ac8983',
        'outline-variant': '#5c403b',
        'inverse-surface': '#e4e2e1',
        'inverse-on-surface': '#303030',
      },
      fontFamily: {
        headline: ['var(--font-display)', 'Space Grotesk', 'sans-serif'],
        label: ['var(--font-display)', 'Space Grotesk', 'sans-serif'],
        body: ['var(--font-body)', 'Inter', 'sans-serif'],
        display: ['var(--font-display)', 'Space Grotesk', 'sans-serif'],
        sans: ['var(--font-body)', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.125rem',
        sm: '0.125rem',
        lg: '0.25rem',
        xl: '0.5rem',
        full: '0.75rem',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        ripple: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(2.5)', opacity: '0' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        ticker: 'ticker 30s linear infinite',
        ripple: 'ripple 1.5s ease-out infinite',
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
