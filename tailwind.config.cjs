/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'media',
  theme: {
    extend: {
      height: {
        'data-input': 'calc(100vh - 22em)',
        'tab-modal-content': 'calc(100vh - 334px)',
        'tab-bar': '54px'
      },
      colors: {
        'asu-maroon': '#8c1d40',
        'asu-gold': '#ffc627',
        'neutral-950': '#0F0F0F',
      },
      maxWidth: {
        'full-modal-width': 'calc(90vw)',
      },
      maxHeight: {
        'full-modal-content-height': 'calc(100vh - 280px)',
      },
      spacing: {
        'full-modal-content-height': 'calc(100vh - 280px)',
        'full-modal-width': 'calc(90vw)',
        'full-column-selector-height': 'calc(100vh - 16em)',
        'full-minus-nav': 'calc(100vh - 64px)',
        'full-minus-sideBar': 'calc(100vw - 18rem)',
        'full-table': 'calc(100vh - 262px)'
      },
      zIndex: {
        '50': '50',
        '60': '60',
        '70': '70',
      },
    },
  },
  plugins: [],
}
