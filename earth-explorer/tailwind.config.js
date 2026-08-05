/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.ts'],
  theme: {
    extend: {
      colors: {
        glass: 'rgba(15, 20, 30, 0.72)',
      },
      backdropBlur: {
        glass: '14px',
      },
    },
  },
  plugins: [],
};
