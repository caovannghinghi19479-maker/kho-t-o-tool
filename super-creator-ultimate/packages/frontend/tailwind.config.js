/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0f172a',
        panel: '#1e293b',
        accent: '#8b5cf6',
        muted: '#94a3b8'
      }
    }
  },
  plugins: []
};
