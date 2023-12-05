/** @type {import('tailwindcss').Config} */
//const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
  ],
  darkMode: 'class', // or 'media' or 'class
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      
      colors: {
        gainsboro: {
          100: "#e8e8e8",
          200: "#e6e6e6",
          300: "#e5e5e5",
          400: "#ddd",
          500: "#d8d8d8",
        },
        darkslategray: {
          100: "#454545",
          200: "#393939",
        },
        unic_red: {
          100: "#ff0000",
          200: "#e60000",
          300: "#e60005",
          400: "#aa061f"
        },
        unic_blue: "#8bcaf7"

      }
    }
  },
  plugins: [],
}

