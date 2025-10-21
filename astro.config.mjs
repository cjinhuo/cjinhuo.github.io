import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'

import react from '@astrojs/react'

// https://astro.build/config
export default defineConfig({
  site: 'https://cjinhuo.netlify.app/',
  syntaxHighlight: 'prism',
  integrations: [mdx(), sitemap(), tailwind(), react()],
  compressHTML: true,
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        limitInputPixels: false // 移除像素限制，允许处理大图片
      }
    }
  }
})
