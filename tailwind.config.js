/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#C76AE9',
          DEFAULT: '#AB39D2',
          dark: '#8F1CB6'
        }
      },
      backgroundImage: {
        'gradient-custom': 'linear-gradient(135deg, #AB39D2 0%, #4F46E5 100%)',
        'gradient-sidebar': 'linear-gradient(180deg, #AB39D2 0%, #312E81 100%)'
      },
      keyframes: {
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' }
        }
      },
      animation: {
        heartbeat: 'heartbeat 1s ease-in-out infinite'
      }
    },
  },
  plugins: [],
};