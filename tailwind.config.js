/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./frontend/*.html",
    "./frontend/*.js",
    "./frontend/**/*.{html,js}"
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Montserrat', 'sans-serif'],
      },
      colors: {
        'primary': '#0a2463', // Definir 'primary' como o seu azul
        'primary-light': '#1e3888', // Variação mais clara do azul (exemplo)
    
        
        'cogim-dark': '#1a1a1a',
        'cogim-text': '#333333',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      }
    },
  },
  plugins: [],
}