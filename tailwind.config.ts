import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          900: '#05070F',
          800: '#0A0E27',
          700: '#0F1530',
          600: '#172041',
        },
        gold: {
          50: '#ECFEFF',
          100: '#CFFAFE',
          200: '#A5F3FC',
          300: '#22D3EE',
          400: '#06B6D4',
          500: '#0891B2',
          600: '#0E7490',
        },
        cyan: {
          300: '#67E8F9',
          400: '#22D3EE',
          500: '#06B6D4',
        },
        violet: {
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
        },
        lime: {
          300: '#BEF264',
          400: '#A3E635',
          500: '#84CC16',
        },
        cream: {
          50: '#F8FAFC',
          100: '#E2E8F0',
          200: '#CBD5E1',
        },
      },
      fontFamily: {
        serif: ['var(--font-inter)', 'system-ui', '-apple-system', 'sans-serif'],
        sans: ['var(--font-inter)', 'system-ui', '-apple-system', 'sans-serif'],
      },
      keyframes: {
        meshShift: {
          '0%, 100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '50%': { transform: 'translate3d(2%,-2%,0) scale(1.05)' },
        },
        floatUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        ctaPulse: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(34,211,238,0.55)' },
          '50%': { boxShadow: '0 0 0 14px rgba(34,211,238,0)' },
        },
        neonGlow: {
          '0%, 100%': { textShadow: '0 0 12px rgba(34,211,238,0.5), 0 0 24px rgba(167,139,250,0.3)' },
          '50%': { textShadow: '0 0 18px rgba(34,211,238,0.85), 0 0 36px rgba(167,139,250,0.5)' },
        },
        slideInUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        mesh: 'meshShift 60s ease-in-out infinite',
        floatUp: 'floatUp .7s cubic-bezier(.2,.7,.2,1) both',
        ctaPulse: 'ctaPulse 2.4s ease-in-out infinite',
        slideInUp: 'slideInUp .35s cubic-bezier(.2,.7,.2,1) both',
        neonGlow: 'neonGlow 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
