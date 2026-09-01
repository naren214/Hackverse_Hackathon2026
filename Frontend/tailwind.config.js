/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        dark: {
          900: '#0F1117',
          800: '#1A1D27',
          700: '#222530',
          600: '#2A2D3A',
        },
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
        info: '#8B5CF6',
        // Theme-aware colors via CSS variables
        t: {
          bg: 'var(--color-bg)',
          card: 'var(--color-bg-card)',
          hover: 'var(--color-bg-hover)',
          input: 'var(--color-bg-input)',
          sidebar: 'var(--color-bg-sidebar)',
          border: 'var(--color-border)',
          text: 'var(--color-text)',
          'text-secondary': 'var(--color-text-secondary)',
          muted: 'var(--color-text-muted)',
        },
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-in',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: 1, boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)' },
          '50%': { opacity: .5, boxShadow: '0 0 20px rgba(59, 130, 246, 0.8)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        shimmer: {
          from: { backgroundPosition: '200% 0' },
          to: { backgroundPosition: '-200% 0' },
        },
      },
      boxShadow: {
        'card': 'var(--shadow-card)',
        'card-hover': 'var(--shadow-card-hover)',
        'glow': 'var(--shadow-glow)',
        'glow-primary': '0 0 15px -3px rgba(59, 130, 246, 0.4)',
        'glow-success': '0 0 15px -3px rgba(34, 197, 94, 0.4)',
        'glow-warning': '0 0 15px -3px rgba(245, 158, 11, 0.4)',
        'glow-danger': '0 0 15px -3px rgba(239, 68, 68, 0.4)',
      },
    },
  },
  plugins: [],
};
