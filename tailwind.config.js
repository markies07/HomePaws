/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'custom' : '1px 1px 15px 2px rgba(0, 0, 0, 0.13)',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: '#F75959',
        primaryHover: '#ff6f6f',
        secondary: '#FAFAFA',
        text: '#5D5D5D',
      },
      screens: {
        'h-sm': { 'raw': '(min-height: 850px)' },
      },
      animation: {
        bounce: 'bounce 1s infinite',
      },
      keyframes: {
        bounce: {
          '0%, 100%': { transform: 'translateY(-25%)', animationTimingFunction: 'cubic-bezier(0.8,0,1,1)' },
          '50%': { transform: 'translateY(0)', animationTimingFunction: 'cubic-bezier(0,0,0.2,1)' },
        },
      },
    },
  },
  plugins: [],
};
