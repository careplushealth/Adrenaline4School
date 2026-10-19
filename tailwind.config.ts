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
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
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
          900: '#0f172a',
          950: '#090d16',
        },
        primary: {
          DEFAULT: '#0f766e', // Deep medical teal
          dark: '#0d5c56',
          light: '#14b8a6',
        },
        accent: {
          yellow: '#f59e0b',
          blue: '#0284c7',
          green: '#10b981',
        },
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          DEFAULT: '#f59e0b',
        },
        sage: {
          50: '#f5f8f6',
          100: '#e8f0ea',
          200: '#d2e1d6',
          300: '#aec6b5',
          400: '#7b9f87',
          500: '#557a63',
          600: '#43634f',
          700: '#344d3d',
          800: '#26392e',
          900: '#1b2a21',
          DEFAULT: '#43634f',
        },
        forest: {
          50: '#f4f6f4',
          100: '#e3eae4',
          200: '#c6d5c9',
          700: '#2c4234',
          800: '#213327',
          900: '#16231a',
          950: '#0e1711',
          DEFAULT: '#16231a',
        },
        ivory: {
          DEFAULT: '#faf8f5',
          soft: '#fdfbf7',
          dark: '#f4efea',
        },
        linen: {
          DEFAULT: '#f6f1ea',
          dark: '#eae3d6',
        },
      },
      fontFamily: {
        serif: [
          'Playfair Display',
          'Cormorant Garamond',
          'Georgia',
          'Cambria',
          'Times New Roman',
          'serif',
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
      },
    },
  },
  plugins: [],
};

export default config;
