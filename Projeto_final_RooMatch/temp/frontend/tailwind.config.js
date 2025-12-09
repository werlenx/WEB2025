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
          DEFAULT: '#6366f1', // Indigo 500
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#1e293b', // Slate 800
          foreground: '#f8fafc',
        },
        accent: {
          DEFAULT: '#f43f5e', // Rose 500
          foreground: '#ffffff',
        },
        background: '#f8fafc', // Slate 50
        surface: '#ffffff',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
