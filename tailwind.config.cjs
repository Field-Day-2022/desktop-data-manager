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
      height: {
        'table': 'calc(100vh - 257px)',
      },
      minWidth: {
        'data-input': '500px',
      },
      maxWidth: {
        'modal-content': 'calc(90vw)',
      },
      minHeight: {
        'data-input': '560px',
      },
      maxHeight: {
        'modal-content': 'calc(100vh - 280px)',
        'column-selector': 'calc(100vh - 16em)',
        'page-content': 'calc(100vh - 64px)',
      },
    },
  },
  plugins: [],
}
