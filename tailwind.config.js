/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-dark': '#0a0a0f',
        'brand-darker': '#111118',
        'brand-card': '#1a1a2e',
        'brand-card2': '#16213e',
        'brand-gold': '#f5c518',
        'brand-gold2': '#d4a017',
        'brand-teal': '#14b8a6',
        'brand-teal2': '#0d9488',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(245, 197, 24, 0.4)' },
          '50%': { boxShadow: '0 0 0 8px rgba(245, 197, 24, 0)' },
        },
      },
    },
  },
  plugins: [],
}
