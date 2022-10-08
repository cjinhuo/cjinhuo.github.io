/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      backgroundColor: {
        skin: {
          background: 'var(--color-normal-bg)',
        },
      },
      maxWidth: {
        custom: {
          prose: 'var(--max-w-65)',
        },
      },
      textColor: {
        skin: {
          'neutral-1': 'var(--color-neutral-1)',
          'neutral-2': 'var(--color-neutral-2)',
          'neutral-3': 'var(--color-neutral-3)',
          'neutral-4': 'var(--color-neutral-4)',
          'neutral-5': 'var(--color-neutral-5)',
          'neutral-6': 'var(--color-neutral-6)',
          link: 'var(--color-link-href)',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
