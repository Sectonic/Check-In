/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
  ],
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'dashboard-break': '1145px',
      'xl': '1280px',
      '2xl': '1536px'
    }
  },
  daisyui: {
    themes: ['winter']
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
}
