/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef7ff",
          100: "#d9edff",
          400: "#4fa8f2",
          500: "#2e86de",
          600: "#1c6dc2",
          700: "#17569b",
        },
      },
    },
  },
  plugins: [],
};
