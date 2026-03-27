/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        slate: {
          925: '#0c1222',
          875: '#111827',
        },
        amber: {
          450: '#f5a623',
        },
        surface: {
          DEFAULT: '#f8f7f5',
          raised: '#ffffff',
          sunken: '#f0eee9',
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        display: ['"Instrument Serif"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        soft: '0 1px 3px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
        card: '0 2px 8px -2px rgb(0 0 0 / 0.08), 0 1px 4px -2px rgb(0 0 0 / 0.04)',
        elevated: '0 8px 24px -8px rgb(0 0 0 / 0.12), 0 2px 8px -4px rgb(0 0 0 / 0.06)',
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1rem',
      },
    },
  },
  plugins: [],
};
