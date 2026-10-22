
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", "sans-serif"],
        display: ["Playfair Display", "serif"],
      },
      colors: {
        ink: "#29221f",
        rose: "#9f4d57",
        blush: "#ead7d2",
        cream: "#f8f4ef",
        gold: "#b28a56",
      },
      boxShadow: {
        soft: "0 16px 45px rgba(48, 34, 29, 0.08)",
      },
    },
  },
  plugins: [],
};
