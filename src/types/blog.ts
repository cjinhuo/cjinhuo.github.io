export interface BlogType {
  title: string
  description: string
  pubDate: string
  heroImage: string
  heroImageAlt: string
  author?: string
  authorHref?: string
}

export type MarkdownInstance<T> = import('astro').MarkdownInstance<T>
