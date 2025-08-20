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
        // Modern Dark Theme - Deep Space Inspired
        'modern-dark': '#0A0B0F',
        'modern-darker': '#060709',
        'modern-surface': '#141620',
        'modern-surface-hover': '#1A1D2B',
        'modern-surface-active': '#202436',
        'modern-border': '#2A2F42',
        'modern-border-light': '#363B54',
        
        // Modern Light Theme - Clean Minimalist
        'modern-light': '#FAFBFC',
        'modern-lighter': '#FFFFFF',
        'modern-surface-light': '#F8F9FA',
        'modern-surface-light-hover': '#F1F3F4',
        'modern-surface-light-active': '#E8EAED',
        'modern-border-light-theme': '#E1E5E9',
        'modern-border-light-subtle': '#F0F2F5',
        
        // Modern Accent Colors - Vibrant & Professional
        'modern-primary': '#6366F1', // Indigo
        'modern-primary-light': '#818CF8',
        'modern-primary-dark': '#4F46E5',
        'modern-secondary': '#8B5CF6', // Purple
        'modern-success': '#10B981', // Emerald
        'modern-warning': '#F59E0B', // Amber
        'modern-error': '#EF4444', // Red
        'modern-info': '#06B6D4', // Cyan
        
        // Modern Text Colors
        'modern-text-primary': '#F9FAFB',
        'modern-text-secondary': '#D1D5DB',
        'modern-text-tertiary': '#9CA3AF',
        'modern-text-primary-light': '#111827',
        'modern-text-secondary-light': '#374151',
        'modern-text-tertiary-light': '#6B7280',
        
        // Modern Gradient Colors
        'gradient-start': '#667EEA',
        'gradient-end': '#764BA2',
        'gradient-warm-start': '#FA709A',
        'gradient-warm-end': '#FEE140',
        'gradient-cool-start': '#A8EDEA',
        'gradient-cool-end': '#FED6E3',
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
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'bounce-subtle': 'bounceSubtle 0.6s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        ripple: {
          '0%': { opacity: '0.7', transform: 'scale(0) translate(-50%, -50%)' },
          '100%': { opacity: '0', transform: 'scale(2) translate(-50%, -50%)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        bounceSubtle: {
          '0%, 20%, 53%, 80%, 100%': { transform: 'translate3d(0,0,0)' },
          '40%, 43%': { transform: 'translate3d(0, -8px, 0)' },
          '70%': { transform: 'translate3d(0, -4px, 0)' },
          '90%': { transform: 'translate3d(0, -2px, 0)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(99, 102, 241, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(99, 102, 241, 0.8)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
        '3xl': '40px',
      },
      boxShadow: {
        'modern': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'modern-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'modern-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'modern-glow': '0 0 20px rgba(99, 102, 241, 0.3)',
        'modern-inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
};