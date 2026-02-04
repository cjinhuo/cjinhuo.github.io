export interface BlogType {
	title: string
	description: string
	pubDate: string
	heroImage: string
	heroImageAlt: string
	author?: string
	authorHref?: string
}

export interface BlogCardProps {
	url: string
	frontmatter: BlogType
}
