import { type CollectionEntry, getCollection } from 'astro:content'

export type StockEntry = CollectionEntry<'stock'>

export async function getSortedStockPosts(): Promise<StockEntry[]> {
	const posts = await getCollection('stock')
	return posts.sort(
		(a: StockEntry, b: StockEntry) => new Date(b.data.pubDate).valueOf() - new Date(a.data.pubDate).valueOf()
	)
}

export function getAllStockTags(posts: StockEntry[]): string[] {
	const tagSet = new Set<string>()
	for (const post of posts) {
		const tags = post.data.tags
		if (tags) {
			for (const tag of tags) {
				tagSet.add(tag)
			}
		}
	}
	return Array.from(tagSet).sort()
}

export interface AdjacentStockPosts {
	prev: StockEntry | null
	next: StockEntry | null
}

/**
 * Returns the newer (prev) and older (next) posts relative to the given id,
 * based on the descending (newest-first) sort order.
 */
export function getAdjacentStockPosts(posts: StockEntry[], id: string): AdjacentStockPosts {
	const index = posts.findIndex((post) => post.id === id)
	if (index === -1) {
		return { prev: null, next: null }
	}
	return {
		prev: index > 0 ? posts[index - 1] : null,
		next: index < posts.length - 1 ? posts[index + 1] : null,
	}
}
