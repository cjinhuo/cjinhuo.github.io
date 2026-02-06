import { getCollection, type CollectionEntry } from 'astro:content'

export type BlogEntry = CollectionEntry<'blogs'>

export async function getSortedBlogPosts(): Promise<BlogEntry[]> {
	const posts = await getCollection('blogs')
	return posts.sort(
		(a: BlogEntry, b: BlogEntry) =>
			new Date(b.data.pubDate).valueOf() - new Date(a.data.pubDate).valueOf()
	)
}
