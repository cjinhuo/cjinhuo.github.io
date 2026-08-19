import { type CollectionEntry, getCollection } from 'astro:content'
import type { StockTrade } from '@/components/Stock/StockCard'

export type StockEntry = CollectionEntry<'stock'>

/**
 * 将文章 frontmatter 中的 trade（单笔）与 trades（多笔）归一化为统一的数组，
 * 使上层组件只需处理一种形态。优先取 trades，回退到单笔 trade，均无则返回空数组。
 */
export function normalizeTrades(data: { trade?: StockTrade; trades?: StockTrade[] }): StockTrade[] {
	if (data.trades && data.trades.length > 0) {
		return data.trades
	}
	if (data.trade) {
		return [data.trade]
	}
	return []
}

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
