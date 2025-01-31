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
        teal: {
          DEFAULT: "#003841",
          foreground: "#FFFFFF",
        },
        primary: {
          DEFAULT: "#F3C178",
          foreground: "#000000",
        },
        secondary: {
          DEFAULT: "#E6E6FA",
          foreground: "#000000",
        },
        background: {
          DEFAULT: "#FFFFFF",
          secondary: "#E8F5E9",
        },
        muted: {
          DEFAULT: "#6B7280",
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
};