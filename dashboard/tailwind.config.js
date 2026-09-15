/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#090A0F",
        surface: "#11131C",
        surfaceBorder: "#1E2235",
        primary: {
          DEFAULT: "#6366F1",
          hover: "#4F46E5",
        },
        accent: "#10B981",
      },
    },
  },
  plugins: [],
};
