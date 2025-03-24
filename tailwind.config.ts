/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: {
          DEFAULT: "#E2E8F0",
        },
        foreground: {
          DEFAULT: "#000000",
        },
        teal: {
          DEFAULT: "rgb(9, 54, 62)", // #09363E
          foreground: "#FFFFFF",
        },
        primary: {
          DEFAULT: "rgb(15, 186, 113)", // #0FBA71
          foreground: "#000000",
        },
        secondary: {
          DEFAULT: "rgb(219, 207, 252)", // #DBCFFC
          foreground: "#000000",
        },
        background: {
          DEFAULT: "#FFFFFF",
          secondary: "#E8F5E9",
        },
        muted: {
          DEFAULT: "rgb(136, 143, 155)", // #888F9B
          foreground: "#000000",
        },
        accent: {
          DEFAULT: "rgb(234, 217, 63)", // #EAD93F
          foreground: "#000000",
        },
      },
      keyframes: {
        "fade-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}