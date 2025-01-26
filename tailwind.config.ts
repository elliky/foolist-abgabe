import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#10B981', // Emerald 500
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#059669', // Emerald 600
          foreground: '#FFFFFF',
        },
        accent: {
          DEFAULT: '#34D399', // Emerald 400
          foreground: '#1F2937', // Gray 800
        },
        background: {
          DEFAULT: '#F3FAF7', // Emerald 50
          dark: '#064E3B', // Emerald 900
        },
        foreground: {
          DEFAULT: '#1F2937', // Gray 800
          dark: '#F9FAFB', // Gray 50
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
