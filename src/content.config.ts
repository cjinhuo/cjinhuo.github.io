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

// 单笔交易数据结构，供单笔 trade 与多笔 trades 复用
const tradeSchema = z.object({
	changePercent: z.string().optional(),
	profit: z.string().optional(),
	buyPrice: z.string().optional(),
	sellPrice: z.string().optional(),
	symbol: z.string().optional(),
	related: z.string().optional(),
})

const stock = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/stock' }),
	schema: () =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.string(),
			updatedDate: z.string().optional(),
			author: z.string().default(BLOG_DEFAULTS.author),
			authorHref: z.string().default(BLOG_DEFAULTS.authorHref),
			tags: z.array(z.string()).optional(),
			// 单笔交易（向后兼容旧文章）
			trade: tradeSchema.optional(),
			// 多笔交易：一次性卖出多个标的时使用
			trades: z.array(tradeSchema).optional(),
		}),
})

export const collections = { blogs, stock }
