/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        neo: {
          bg: '#181818',
          card: '#1F1F1F',
          border: '#2A2A2A',
          text: '#EAEAEA',
          sub: '#AAAAAA',
          purple: '#836EF9',
          purpleDim: '#6f5be8'
        }
      },
      boxShadow: {
        glass: '0 8px 24px rgba(131, 110, 249, 0.15)'
      },
      backdropBlur: {
        xs: '2px'
      }
    },
  },
  plugins: [],
}
