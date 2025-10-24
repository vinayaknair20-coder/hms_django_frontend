/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Hospital Brand Colors
        'hospital': {
          mint: '#BCE7D9',
          white: '#F8F8F8',
          gray: '#E1E8EC',
          navy: '#4C5175',
        },
        // Role-Based Colors (Optional - for different modules)
        'admin': {
          primary: '#4C5175',
          secondary: '#E1E8EC',
        },
        'pharmacist': {
          primary: '#BCE7D9',
          secondary: '#4C5175',
        },
        'doctor': {
          primary: '#4C5175',
          secondary: '#BCE7D9',
        },
        'receptionist': {
          primary: '#E1E8EC',
          secondary: '#4C5175',
        },
      },
    },
  },
  plugins: [],
}
