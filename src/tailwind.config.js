/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brown: {
          500: '#A0522D', // Marron pour "CryptoPay"
        },
      },
    },
  },
  plugins: [],
};
