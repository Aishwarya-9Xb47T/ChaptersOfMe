/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: {
          50: '#FDFBF7',
          100: '#FAF6F0',
          200: '#F4ECE1',
          300: '#E8DCCB',
          400: '#D5C4AC',
          500: '#BFA88D',
          600: '#A48B6F',
          700: '#866F56',
          800: '#675543',
          900: '#4A3E31',
        },
        ink: {
          950: '#141211',
          900: '#1C1917',
          800: '#292524',
          700: '#44403C',
          600: '#57534E',
          500: '#78716C',
          400: '#A8A29E',
          300: '#D6D3D1',
        },
        amberGold: {
          50: '#FDF9F0',
          100: '#FAF0DB',
          200: '#F3DDAB',
          300: '#ECC77B',
          400: '#E4AE4B',
          500: '#C5A880',
          600: '#B08E5D',
          700: '#8C6C3D',
          800: '#694F2C',
        },
        rosewood: {
          50: '#FBF6F5',
          100: '#F5EAE7',
          200: '#EBD1CB',
          300: '#DDB3AA',
          400: '#CC8E81',
          500: '#B26E5E',
          600: '#945446',
          700: '#764136',
          800: '#5C322A',
        },
        sageMuted: {
          50: '#F6F8F5',
          100: '#EAEEE8',
          200: '#D5DDD1',
          300: '#B8C6B2',
          400: '#97A98F',
          500: '#778C6E',
          600: '#5D7055',
          700: '#475641',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        display: ['"Playfair Display"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
