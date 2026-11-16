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
        apple: {
          gray: '#f5f5f7',
          subtle: '#86868b',
          dark: '#1d1d1f',
          darker: '#161617',
          border: 'rgba(0, 0, 0, 0.08)',
          'border-dark': 'rgba(255, 255, 255, 0.12)',
        },
        brand: {
          50: '#f0fdf9',
          100: '#e6f7f2',
          200: '#c6eee3',
          300: '#90dcce',
          400: '#4ec0ad',
          500: '#09653d', // Brand Green (from pen logo)
          600: '#064e2e',
          700: '#033e24',
          800: '#073620', // Deep Forest Green
          900: '#052817',
          950: '#031a0f',
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
          800: '#0d472b',
          900: '#073620',
          950: '#041f13',
        },
        primary: {
          DEFAULT: '#09653d', // Primary Deep Teal Green
          dark: '#064e2e',
          light: '#0d8270',
        },
        mint: {
          50: '#f9fcfb',
          100: '#f2faf7',
          200: '#e6f5f1',
          300: '#d1ede5',
        },
        accent: {
          teal: '#09653d',
          blue: '#0284c7',
          green: '#16a34a',
        },
        gold: {
          50: '#f0fdf9',
          100: '#e6f7f2',
          200: '#c6eee3',
          300: '#90dcce',
          400: '#4ec0ad',
          500: '#09653d',
          600: '#064e2e',
          700: '#033e24',
          800: '#042f27',
          900: '#021f1a',
          DEFAULT: '#09653d',
        },
        sage: {
          50: '#f0fdf9',
          100: '#e6f7f2',
          200: '#c1eee0',
          300: '#87ddc6',
          400: '#2ec49d',
          500: '#09653d',
          600: '#09653d',
          700: '#064e2e',
          800: '#033e24',
          900: '#032a23',
          DEFAULT: '#09653d',
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
          teal: '#09653d',
          green: '#09653d',
          darkGreen: '#064e2e',
          aqua: '#00a499',
        },
      },
      fontFamily: {
        serif: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"Plus Jakarta Sans"',
          'Inter',
          'sans-serif',
        ],
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Text"',
          '"SF Pro Display"',
          '"Plus Jakarta Sans"',
          'Inter',
          'sans-serif',
        ],
        display: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"Plus Jakarta Sans"',
          'Inter',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};

export default config;
