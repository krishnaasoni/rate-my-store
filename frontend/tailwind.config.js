/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#339D9E',
          dark: '#1F6F72',
          soft: '#E3F5F4',
        },
        accent: {
          DEFAULT: '#FF8F54',
          hover: '#E87A3E',
        },
        app: {
          bg: '#FFF9EE',
          card: '#FFFFFF',
          text: '#12343B',
          muted: '#5B7479',
          border: '#EADFC8',
        },
      },
    },
  },
  plugins: [],
};
