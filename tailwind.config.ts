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
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#93C5FD',
          300: '#3B82F6',
          400: '#2563EB',
          500: '#1D4ED8',
          600: '#1E40AF',
        },
        cyan: {
          400: '#22d3ee',
          500: '#00E5FF',
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
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(59,130,246,0.45)' },
          '50%': { boxShadow: '0 0 0 12px rgba(59,130,246,0)' },
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
      },
    },
  },
  plugins: [],
};

export default config;
