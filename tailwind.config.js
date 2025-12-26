const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'pink': '#D1014C',
        'bright-pink': '#FF005C',
        'secondary-black': '#1f1f1f',
        'black': '#141414',
        'white': '#ffffff',
        gray: colors.gray,
        indigo: colors.indigo,
        red: colors.rose,
        yellow: colors.amber
      }
    }
  },
  plugins: []
}
