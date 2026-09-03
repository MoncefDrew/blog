/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: 'var(--theme-accent)',
          hover: 'var(--theme-accent-hover)',
        },
        card: {
          DEFAULT: 'var(--theme-card-bg)',
        },
        themeBorder: {
          DEFAULT: 'var(--theme-border)',
          dark: 'var(--theme-border-dark)',
        },
        toolbar: {
          DEFAULT: 'var(--theme-toolbar-bg)',
        },
      },
    },
  },
  plugins: [],
};
