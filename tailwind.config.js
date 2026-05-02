/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Fraunces"', '"Instrument Serif"', 'serif'],
        sans: ['"Inter Tight"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      colors: {
        ink: {
          950: '#07060F',
          900: '#0A0820',
          800: '#0E0C20',
          700: '#1A1730',
          600: '#2A2548'
        },
        accent: {
          cyan: '#2997FF',
          blue: '#5FB6FF',
          indigo: '#C064F0',
          violet: '#8E4EC6',
          amber: '#F5A623',
          gold: '#FFB84D',
          teal: '#00C7BE',
          coral: '#FF375F'
        }
      },
      animation: {
        'fade-up': 'fadeUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 8s linear infinite',
        'grid-march': 'gridMarch 18s linear infinite',
        'horizon-pulse': 'horizonPulse 6s ease-in-out infinite',
        'lightcycle': 'lightcycle 12s linear infinite'
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' }
        }
      },
      transitionTimingFunction: {
        'mcd': 'cubic-bezier(0.22, 1, 0.36, 1)'
      }
    }
  },
  plugins: []
}
