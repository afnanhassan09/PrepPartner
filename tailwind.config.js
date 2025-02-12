/** @type {import('tailwindcss').Config} */
module.exports = {
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
        "slide-in": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "scale-up": {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        blob: {
          "0%, 100%": {
            borderRadius: "60% 40% 30% 70%/60% 30% 70% 40%",
          },
          "50%": {
            borderRadius: "30% 60% 70% 40%/50% 60% 30% 60%",
          },
        },
        "gradient-xy": {
          "0%, 100%": {
            backgroundSize: "400% 400%",
            backgroundPosition: "0% 0%",
          },
          "50%": {
            backgroundSize: "200% 200%",
            backgroundPosition: "100% 100%",
          },
        },
        "pulse-glow": {
          "0%, 100%": {
            opacity: 1,
            transform: "scale(1)",
            filter: "brightness(100%)",
          },
          "50%": {
            opacity: 0.8,
            transform: "scale(1.05)",
            filter: "brightness(150%)",
          },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out",
        "slide-in": "slide-in 0.6s ease-out",
        "scale-up": "scale-up 0.5s ease-out",
        float: "float 6s ease-in-out infinite",
        blob: "blob 8s ease-in-out infinite",
        "gradient-xy": "gradient-xy 15s ease infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
