/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./frontend/**/*.{html,js,jsx,ts,tsx}", // pega tudo dentro da pasta, inclusive src
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
      },
      colors: {
        primary: '#0a2463',
        'primary-light': '#1e3888',
        'cogim-dark': '#1a1a1a',
        'cogim-text': '#333333',
      },
      spacing: {
        18: '4.5rem',
        88: '22rem',
      },
    },
  },
  plugins: [],
}
