/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sa-green': '#007A4D',
        'sa-blue': '#002395',
        'sa-yellow': '#FFB612',
        'sa-red': '#DE3831',
        'sa-black': '#000000',
        'sa-white': '#FFFFFF',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}