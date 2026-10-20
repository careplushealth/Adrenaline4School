import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdf9',
          100: '#e6f7f2',
          200: '#c6eee3',
          300: '#90dcce',
          400: '#4ec0ad',
          500: '#096556', // Deep Emerald / Pine Teal (from picture)
          600: '#075145',
          700: '#053e34',
          800: '#0c2340', // Deep Navy
          900: '#081728',
          950: '#040c16',
        },
        navy: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0c2340',
          950: '#081525',
        },
        primary: {
          DEFAULT: '#096556', // Primary Deep Teal Green
          dark: '#075145',
          light: '#0d8270',
        },
        mint: {
          50: '#f9fcfb',
          100: '#f2faf7',
          200: '#e6f5f1',
          300: '#d1ede5',
        },
        accent: {
          teal: '#096556',
          blue: '#0284c7',
          green: '#16a34a',
        },
        gold: {
          50: '#f0fdf9',
          100: '#e6f7f2',
          200: '#c6eee3',
          300: '#90dcce',
          400: '#4ec0ad',
          500: '#096556',
          600: '#075145',
          700: '#053e34',
          800: '#042f27',
          900: '#021f1a',
          DEFAULT: '#096556',
        },
        sage: {
          50: '#f0fdf9',
          100: '#e6f7f2',
          200: '#c1eee0',
          300: '#87ddc6',
          400: '#2ec49d',
          500: '#096556',
          600: '#096556',
          700: '#075145',
          800: '#053e34',
          900: '#032a23',
          DEFAULT: '#096556',
        },
        forest: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          700: '#1e3a5f',
          800: '#132c4a',
          900: '#0c2340', // Deep Clinical Navy
          950: '#071526',
          DEFAULT: '#0c2340',
        },
        ivory: {
          DEFAULT: '#ffffff', // Crisp Clinical White
          soft: '#fbfdfd',
          dark: '#f4faf8',
        },
        linen: {
          DEFAULT: '#f4faf8', // Soft Mint/Ice Tint
          dark: '#e6f5f1',
        },
        nhs: {
          blue: '#005eb8',
          darkBlue: '#003087',
          deepNavy: '#0c2340',
          brightBlue: '#0072ce',
          lightBlue: '#41b6e6',
          paleBlue: '#e8f4f8',
          ice: '#f0f9f7',
          teal: '#096556',
          green: '#096556',
          darkGreen: '#075145',
          aqua: '#00a499',
        },
      },
      fontFamily: {
        serif: [
          'Plus Jakarta Sans',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        sans: [
          'Plus Jakarta Sans',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        display: [
          'Plus Jakarta Sans',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};

export default config;
