/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts,scss}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e0e0e0', // light gray
          100: '#b0b0b0', // light gray
          200: '#808080', // medium gray
          300: '#505050', // dark gray
          400: '#303030', // darker gray
          500: '#1a1a1a', // very dark gray (slightly lighter than black)
          600: '#121212', // almost black, with a bit of distinction
          700: '#0d0d0d', // darker black
          800: '#080808', // very dark black, more noticeable
          900: '#030303', // nearly pure black, but still distinguishable
          DEFAULT: '#000000', // black
        },
        success: {
          light: '#dcfce7',
          DEFAULT: '#16a34a',
        },
        danger: {
          light: '#fee2e2',
          DEFAULT: '#dc2626',
        },
        warning: {
          light: '#fef3c7',
          DEFAULT: '#d97706',
        },
        background: {
          primary: '#ffffff',
          secondary: '#f8fafc',
          dark: '#111827',
        }
      },
      borderWidth: {
        '1': '1px',
        'DEFAULT': '1px',
      },
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1600px',
      },
    }
  },
  plugins: [
    require('flowbite/plugin'),
    require('tailwindcss-animated'),
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
  ],
}