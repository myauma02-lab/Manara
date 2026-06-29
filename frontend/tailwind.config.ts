// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#266c87',
          dark: '#1a4f63',
          light: '#3a8aaa',
          pale: '#ddeef4',
        },
        teal: { 1: '#86AFAA', 2: '#5F8F8A', 3: '#3F6F6A' },
        olive: { 1: '#A4AA7A', 2: '#8A8F5E', 3: '#6E7448' },
        sand: { 1: '#D8C3A7', 2: '#C6AD8A', 3: '#A78E6D' },
        deep: '#0F2830',
        ink: {
          DEFAULT: '#1C3038',
          mid: '#3A5560',
          light: '#7A9AA5',
          ghost: '#B8CDD2',
        },
        ivory: '#F4F7F7',
        'warm-white': '#F8FAFA',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) forwards',
        'fade-in': 'fadeIn 0.5s ease forwards',
        'slide-line': 'slideLine 2s ease-in-out infinite',
        'pulse-dot': 'pulseDot 2s ease-in-out infinite',
        'counter': 'counter 2s ease-out forwards',
      },
      keyframes: {
        fadeUp: { from: { opacity: '0', transform: 'translateY(24px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideLine: { '0%': { transform: 'translateX(-100%)' }, '100%': { transform: 'translateX(200%)' } },
        pulseDot: { '0%,100%': { opacity: '1', transform: 'scale(1)' }, '50%': { opacity: '0.4', transform: 'scale(0.75)' } },
      },
      backdropBlur: { xs: '2px' },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;
