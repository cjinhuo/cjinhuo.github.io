import { defineConfig, fontProviders } from 'astro/config'
import { unified } from '@astrojs/markdown-remark'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import remarkDirective from 'remark-directive'
import { remarkContainer } from './src/plugins/remark-container.mjs'

import react from '@astrojs/react'

// https://astro.build/config
export default defineConfig({
  site: 'https://cjinhuo.netlify.app/',
  fonts: [
    {
      name: 'Roboto',
      cssVariable: '--font-roboto',
      provider: fontProviders.fontsource(),
    },
  ],
  syntaxHighlight: 'prism',
  markdown: {
    processor: unified({
      remarkPlugins: [remarkDirective, remarkContainer],
      gfm: true,
      smartypants: true,
    }),
  },
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
