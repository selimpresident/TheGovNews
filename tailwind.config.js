module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./index.html"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['SF Pro Display', 'Inter', 'sans-serif'],
      },
      colors: {
        'analyst-dark-bg': '#171924',
        'analyst-sidebar': '#202330',
        'analyst-input': '#2a2e3f',
        'analyst-item-active': '#3a3f57',
        'analyst-item-hover': '#2f344a',
        'analyst-accent': '#0A84FF', // Apple Blue
        'analyst-green': '#34C759', // Apple Green
        'analyst-purple': '#5856D6', // Apple Purple
        'analyst-orange': '#FF9500', // Apple Orange
        'analyst-border': '#2f344a',
        'analyst-text-primary': '#F0F2F5',
        'analyst-text-secondary': '#8A91A8',
      },
      screens: {
        'xs': '320px',   // Small phones
        'sm': '640px',   // Large phones
        'md': '768px',   // Tablets
        'lg': '1024px',  // Laptops
        'xl': '1280px',  // Desktops
        '2xl': '1536px', // Large screens
      },
      spacing: {
        'safe-top': 'var(--sat)',
        'safe-right': 'var(--sar)',
        'safe-bottom': 'var(--sab)',
        'safe-left': 'var(--sal)',
      },
      animation: {
        'ripple': 'ripple 0.6s linear forwards',
      },
      keyframes: {
        ripple: {
          '0%': { opacity: '0.7', transform: 'scale(0) translate(-50%, -50%)' },
          '100%': { opacity: '0', transform: 'scale(2) translate(-50%, -50%)' },
        },
      },
    },
  },
  plugins: [],
};