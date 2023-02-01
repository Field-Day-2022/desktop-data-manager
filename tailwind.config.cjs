/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'grand-canyon': "url('./assets/grandcanyon.png')"
      },
      colors: {
        'asu-maroon': '#8c1d40',
        'asu-gold': '#ffc627'
      },
      spacing: {
        'full-minus-nav': 'calc(100vh - 64px)',
      }
    },
  },
  plugins: [],
}
