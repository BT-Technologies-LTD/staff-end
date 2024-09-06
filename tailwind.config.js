/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";

module.exports = {
  content: ["./front/**/*.{html,js}", "node_modules/preline/dist/*.js"],
  theme: {
    extend: {},
  },
  plugins: [
    daisyui,
    function ({ addUtilities }) {
      const newUtilities = {
        ".no-arrows": {
          "-webkit-appearance": "none",
          "-moz-appearance": "textfield",
        },
        ".no-arrows::-webkit-inner-spin-button, .no-arrows::-webkit-outer-spin-button":
          {
            "@apply appearance-none": {},
            margin: "0",
          },
      };
      addUtilities(newUtilities, ["responsive", "hover"]);
    },
  ],
  daisyui: {
    themes: ["light", "dark"],
    darkTheme: "dark", // name of one of the included themes for dark mode
    base: true, // applies background color and foreground color for root element by default
    styled: true,
    hemeRoot: "*",
  },
  darkMode: ["class", '[data-theme="dark"]'],
};
