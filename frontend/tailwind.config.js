/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#08111f",
        fog: "#dce8f8",
        accent: {
          DEFAULT: "#ff8a00",
          100: "#ffe0bf",
          200: "#ffc280",
          300: "#ffad4d",
          400: "#ff981a",
        },
        mint: {
          DEFAULT: "#87f6d1",
          100: "#e8fff7",
          200: "#bafbe4",
          300: "#87f6d1",
          400: "#58e6b8",
        },
        sky: {
          DEFAULT: "#7dd3fc",
          100: "#e0f6ff",
          200: "#bae6fd",
          300: "#93dfff",
          400: "#7dd3fc",
        },
      },
      fontFamily: {
        display: ["Poppins", "ui-sans-serif", "system-ui"],
        body: ["Manrope", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        glow: "0 20px 60px rgba(125, 211, 252, 0.18)",
      },
    },
  },
  plugins: [],
};
