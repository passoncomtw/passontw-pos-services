/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2C5282"
        },
        secondary: {
          DEFAULT: "#4299E1"
        },
        accent: {
          DEFAULT: "#E53E3E"
        },
        success: {
          DEFAULT: "#38A169"
        },
        warning: {
          DEFAULT: "#DD6B20"
        },
        background: {
          DEFAULT: "#EDF2F7"
        },
        textPrimary: {
          DEFAULT: "#1A202C"
        }
      },
      fontFamily: {
        sans: ['Noto Sans TC', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 