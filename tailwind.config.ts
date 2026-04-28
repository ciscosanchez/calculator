import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: '#0D1B2E',
        brand: {
          DEFAULT: '#2563EB',
          pill:    '#1D4ED8',
          light:   '#EFF6FF',
        },
        success: {
          DEFAULT: '#16A34A',
          bg:      '#F0FDF4',
          border:  '#BBF7D0',
        },
        danger: {
          DEFAULT: '#DC2626',
          bg:      '#FEF2F2',
          border:  '#FECACA',
        },
        warning: {
          DEFAULT: '#D97706',
          bg:      '#FFFBEB',
          border:  '#FDE68A',
          dark:    '#92400E',
        },
        accent: {
          DEFAULT: '#7C3AED',
          bg:      '#F5F3FF',
          border:  '#DDD6FE',
        },
        'page-bg': '#F0F4F8',
        'ui-border': '#E5E7EB',
        'text-main': '#111827',
        'text-sub':  '#6B7280',
      },
      fontFamily: {
        sans:      ['var(--font-barlow)', 'sans-serif'],
        condensed: ['var(--font-barlow-condensed)', 'sans-serif'],
      },
      spacing: {
        sidebar: '220px',
        topbar:  '60px',
      },
      width: {
        sidebar: '220px',
      },
      height: {
        topbar: '60px',
      },
      minWidth: {
        sidebar: '220px',
      },
    },
  },
  plugins: [],
}

export default config
