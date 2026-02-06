import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'
import { BLOG_DEFAULTS } from '@/constants/blog'

const blogs = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blogs' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.string(),
			updatedDate: z.string().optional(),
			author: z.string().default(BLOG_DEFAULTS.author),
			authorHref: z.string().default(BLOG_DEFAULTS.authorHref),
			heroImage: image().optional(),
			heroImageAlt: z.string().optional(),
			tags: z.array(z.string()).optional(),
		}),
})

export const collections = { blogs }
