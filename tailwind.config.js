/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    // This line tells Tailwind to scan all JavaScript, TypeScript, JSX, and TSX files in your src/ directory for Tailwind classes.
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}