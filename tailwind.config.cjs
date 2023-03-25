/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'asu-maroon': '#8c1d40',
        'asu-gold': '#ffc627'
      },
      spacing: {
        'full-modal-content-height': 'calc(100vh - 280px)',
        'full-modal-width': 'calc(90vw)',
        'full-column-selector-height': 'calc(100vh - 16em)',
        'full-minus-nav': 'calc(100vh - 64px)',
        'full-minus-sideBar': 'calc(100vw - 18rem)',
        'full-table': 'calc(100vh - 273px)'
      }
    },
  },
  plugins: [],
}
