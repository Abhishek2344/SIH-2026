/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        farmer: {
          50: '#f4fbf4',
          100: '#e6f7e6',
          200: '#c2edc3',
          300: '#94dd96',
          400: '#5fc464',
          500: '#38a83d',
          600: '#2b8730',
          700: '#246b28',
          800: '#205523',
          900: '#1b461f',
          950: '#0a260d',
        },
        earth: {
          50: '#faf7f2',
          100: '#f2eae0',
          200: '#e3d2bd',
          300: '#d0b395',
          400: '#bc936f',
          500: '#aa7a53',
          600: '#976444',
          700: '#7a4e39',
          800: '#644033',
          900: '#53362c',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
