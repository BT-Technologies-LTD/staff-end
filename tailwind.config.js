/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";

module.exports = {
  content: ["./front/**/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: ["light", "black"],
    darkTheme: "black",
    darkTheme: "dark", // name of one of the included themes for dark mode
    base: true, // applies background color and foreground color for root element by default
    styled: true,
    hemeRoot: "*",
  },
  darkMode: ["class", '[data-theme="black"]'],
};
