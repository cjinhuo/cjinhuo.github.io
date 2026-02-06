import { type CollectionEntry, getCollection } from 'astro:content'

export type BlogEntry = CollectionEntry<'blogs'>

export interface PostsByMonth {
	month: number
	monthName: string
	posts: BlogEntry[]
}

export interface PostsByYear {
	year: number
	months: PostsByMonth[]
	totalPosts: number
}

export interface TimelineData {
	years: PostsByYear[]
	allTags: string[]
}

const MONTH_NAMES = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
]

export async function getSortedBlogPosts(): Promise<BlogEntry[]> {
	const posts = await getCollection('blogs')
	return posts.sort(
		(a: BlogEntry, b: BlogEntry) => new Date(b.data.pubDate).valueOf() - new Date(a.data.pubDate).valueOf()
	)
}

export function getAllTags(posts: BlogEntry[]): string[] {
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

export function groupPostsByYearMonth(posts: BlogEntry[]): PostsByYear[] {
	const yearMap = new Map<number, Map<number, BlogEntry[]>>()

	for (const post of posts) {
		const date = new Date(post.data.pubDate)
		const year = date.getFullYear()
		const month = date.getMonth()

		if (!yearMap.has(year)) {
			yearMap.set(year, new Map())
		}
		const monthMap = yearMap.get(year)
		if (monthMap) {
			if (!monthMap.has(month)) {
				monthMap.set(month, [])
			}
			monthMap.get(month)?.push(post)
		}
	}

	const result: PostsByYear[] = []
	const sortedYears = Array.from(yearMap.keys()).sort((a, b) => b - a)

	for (const year of sortedYears) {
		const monthMap = yearMap.get(year)
		if (!monthMap) continue
		const sortedMonths = Array.from(monthMap.keys()).sort((a, b) => b - a)

		const months: PostsByMonth[] = sortedMonths.map((month) => ({
			month,
			monthName: MONTH_NAMES[month] ?? '',
			posts: monthMap.get(month) ?? [],
		}))

		result.push({
			year,
			months,
			totalPosts: months.reduce((sum, m) => sum + m.posts.length, 0),
		})
	}

	return result
}

export function filterPostsByTag(posts: BlogEntry[], tag: string | null): BlogEntry[] {
	if (!tag || tag === 'All') {
		return posts
	}
	return posts.filter((post) => post.data.tags?.includes(tag))
}

export function getAvailableYears(posts: BlogEntry[]): number[] {
	const years = new Set<number>()
	for (const post of posts) {
		years.add(new Date(post.data.pubDate).getFullYear())
	}
	return Array.from(years).sort((a, b) => b - a)
}

export async function getTimelineData(): Promise<TimelineData> {
	const posts = await getSortedBlogPosts()
	return {
		years: groupPostsByYearMonth(posts),
		allTags: getAllTags(posts),
	}
}
