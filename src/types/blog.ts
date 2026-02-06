import type { ImageMetadata } from 'astro'

export interface BlogType {
	title: string
	description: string
	pubDate: string
	updatedDate?: string
	heroImage?: ImageMetadata
	heroImageAlt?: string
	author: string
	authorHref: string
	tags?: string[]
}

export interface BlogCardProps {
	slug: string
	frontmatter: BlogType
}
