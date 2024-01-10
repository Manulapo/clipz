/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{html,js}", "./components/**/*.{html,js}"],
  safelist: ["bg-blue-400", "bg-green-400", "bg-red-400"],
  theme: {
    extend: {},
  },
  plugins: [],
};
