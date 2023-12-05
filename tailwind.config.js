/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
  './*/*.html', 
  './components/**/*.{html,js}',
  "./src/**/*.{html,js}"
  ],
  theme: {
    extend: {
      fontFamily: {
        'helvetica': ['Helvetica Neue', 'sans-serif'],
        'roboto': ['Roboto', 'sans-serif']
      },
      colors: {
        'brown': {
          25: '#F9F5F3',
          50: '#F0E5E1',
          100: '#815F51',
          200: '#4D3328',
          300: '#36241C',
          400: '#e6d5ce',
        },
      }
    },
  },
  plugins: [
  ]
}
