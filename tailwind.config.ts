import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          900: '#0A0E27',
          800: '#0B1426',
          700: '#101a36',
          600: '#152043',
        },
        gold: {
          50: '#FBF6E8',
          100: '#F2E5BD',
          200: '#EAD49C',
          300: '#E8C77E',
          400: '#D4AF5C',
          500: '#B8923D',
          600: '#8E6F2A',
        },
        cyan: {
          400: '#22d3ee',
          500: '#00E5FF',
        },
        cream: {
          50: '#FAF6EE',
          100: '#F5F0E1',
          200: '#E7DFC8',
        },
      },
      fontFamily: {
        serif: ['var(--font-fraunces)', 'ui-serif', 'Georgia', 'serif'],
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
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(232,199,126,0.45)' },
          '50%': { boxShadow: '0 0 0 12px rgba(232,199,126,0)' },
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
