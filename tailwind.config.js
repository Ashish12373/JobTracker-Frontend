/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  darkMode: 'class', // Enables class-based dark mode
  theme: {
    extend: {
      colors: {
        lightBg: '#ffffff',
        darkBg: '#1a1a1a',
        lightCard: '#f3f4f6',
        darkCard: '#1f2937',
        lightText: '#111827',
        darkText: '#f9fafb',
        primary: '#6366f1' // Optional, for buttons etc.
      },
    },
  },
  plugins: [],
}
