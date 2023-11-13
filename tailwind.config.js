/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
  './*/*.html', 
  './components/**/*.{html,js}',
  './src/**/*.{html,js}',
  "./node_modules/flowbite/**/*.js",],
  theme: {
    extend: {
      colors: {
        'brown': {
          50: '#F0E5E1',
          100: '#815F51',
          200: '#4D3328',
          300: '#36241C'
        },
      }
    },
  },
  plugins: [
    require('flowbite/plugin')
  ]
}

