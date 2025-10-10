/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        agent: '#3b82f6',
        tool: '#eab308',
        logic: '#f97316',
        data: '#a855f7',
      },
    },
  },
  plugins: [],
}
