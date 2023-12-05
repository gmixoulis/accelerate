/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT")
const { colors: defaultColors } = require("tailwindcss/defaultTheme")
const colors = {
  ...defaultColors,
  ...{
    white: "#fff",
    unicgray: {
      100: "#fafafa",
      200: "#272727",
    },
    whitesmoke: "#f0f0f0",
    dimgray: {
      100: "#707070",
      200: "#58595b",
    },

    darkslategray: {
      100: "#454545",
      200: "#393939",
    },
    unicred: {
      100: "#FF0000",
      200: "#e60000",
      300: "#e60005",
      400: "#aa061f",
    },
    unic_blue: "#8bcaf7",
    gainsboro: {
      100: "#e8e8e8",
      200: "#e6e6e6",
      300: "#e5e5e5",
      400: "#ddd",
      500: "#d8d8d8",
    },
    lightskyblue: "#8bcaf7",
    silver: {
      100: "#bababa",
      200: "#b5b5b5",
    },

    red: {
      100: "#ff0000",
      200: "#e60000",
      300: "#e60005",
    },
    green: {
      100: "#00a500",
      200: "#00ef00",
    },
    neutral: {
      900: "#171717",
    },
  },
}

module.exports = withMT({
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/pages/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
    "./node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    screens: {
      sm: "640px",

      md: "768px",

      lg: "1024px",

      xl: "1280px",
      "1xl": "1430",
      "2xl": "1536px",
      "3xl": "1900px",
      "4xl": "2200px",
    },
    extend: {
      colors: colors,
      fontFamily: {
        medium: "Helvetica Neue Greek",
        light: "Helvetica Neue Greek",
        bold: "Helvetica Neue Greek",
        regular: "Helvetica Neue Greek",
      },
    },
    fontSize: {
      base: "16px",
      "53xl": "35px",
      "7xl": "22px",
      "9xl": "24px",
      "2xl": "21px",
      md: "16px",
      sm: "14px",
      lg: "18px",
    },

    backgroundImage: {
      signin: "url('/signin.png')",
      // 'footer-texture': "url('/img/footer-texture.png')",
    },
  },
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: ["./app/**/*.{js,ts,jsx,tsx}", "./pages/**/*.{js,ts,jsx,tsx}"],

  // corePlugins: {
  //   preflight: false,
  // },
  plugins: [require("@tailwindcss/typography")],
})
