import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
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
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['light'],
  },
};
export default config;
