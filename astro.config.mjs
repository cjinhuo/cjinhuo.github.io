import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'

import react from '@astrojs/react'

// https://astro.build/config
export default defineConfig({
  site: 'https://cjinhuo.netlify.app/',
  syntaxHighlight: 'prism',
  integrations: [mdx(), sitemap(), react()],
  compressHTML: true,
  vite: {
    plugins: [tailwindcss()]
  },
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        limitInputPixels: false
      }
    }
  }
})
