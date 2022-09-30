/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      textColor: {
        skin: {
          nav: {
            base: 'var(--color-text-nav-base)',
            hover: 'var(--color-text-nav-hover)',
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
