import tailwindcssReactAriaComponents from "tailwindcss-react-aria-components";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "media",
  theme: {
    extend: {},
  },
  plugins: [
    tailwindcssReactAriaComponents,
  ],
};
