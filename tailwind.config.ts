import type { Config } from 'tailwindcss';

const config = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        gsans: ['var(--font-gsans)'],
        gilroy: ['var(--font-gilroy)'],
      },
      boxShadow: {
        c: '0 1px 6px rgb(32 33 36 / 28%)',
        c2: '0 1px 1px rgb(0 0 0 / 10%)',
        darkC: '0px 1px 6px rgba(150 150 150 / 20%)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('daisyui'), require('tailwindcss-animate')],
  daisyui: {
    themes: [
      {
        light: {
          ...require('daisyui/src/theming/themes')['light'],
          secondary: '#937cee',
        },
      },
    ],
  },
} satisfies Config;

export default config;
