/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2F5233', // Military Green
          light: '#3E6B44',
          dark: '#1F3822',
        },
        secondary: {
          DEFAULT: '#F0F4F0', // Light Green/Beige
          dark: '#E0E8E0',
        },
        accent: {
          DEFAULT: '#D4A574', // Gold
          light: '#E5C49F',
        },
        neutral: {
          dark: '#1F1F1F',
          gray: '#404040',
          light: '#E8E8E8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
