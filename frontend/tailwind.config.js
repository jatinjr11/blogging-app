/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // enable class-based dark mode
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customGray: '#f8f9fa',
        primary: "#2563EB", // blue-600
      },
      transitionProperty: {
        'height': 'height',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        }
      }, animation: {
        fadeInUp: 'fadeInUp 0.7s ease-out forwards',
        'fade-in': 'fadeIn 1s ease-out forwards',

        
      }
    },
  },
  plugins: [],
}