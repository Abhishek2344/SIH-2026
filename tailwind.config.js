/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          navy: '#0b2238',
          blue: '#133e66',
          sky: '#0284c7',
          light: '#f0f5fa',
          saffron: '#f97316',
          green: '#15803d',
          gold: '#d97706',
          border: '#dbeafe',
        },
        slate: {
          850: '#152238',
          950: '#070d18',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'gov': '0 1px 3px 0 rgba(11, 34, 56, 0.1), 0 1px 2px 0 rgba(11, 34, 56, 0.06)',
        'gov-md': '0 4px 6px -1px rgba(11, 34, 56, 0.1), 0 2px 4px -1px rgba(11, 34, 56, 0.06)',
        'gov-lg': '0 10px 15px -3px rgba(11, 34, 56, 0.1), 0 4px 6px -2px rgba(11, 34, 56, 0.05)',
      }
    },
  },
  plugins: [],
}
