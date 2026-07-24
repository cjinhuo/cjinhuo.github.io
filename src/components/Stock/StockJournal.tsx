import { useMemo, useState } from 'react'
import StockCard, { type StockCardData } from './StockCard'

const PAGE_SIZE = 4

interface StockJournalProps {
	posts: StockCardData[]
	allTags: string[]
}

export default function StockJournal({ posts, allTags }: StockJournalProps) {
	const [selectedTag, setSelectedTag] = useState('全部')
	const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

	const tags = useMemo(() => ['全部', ...allTags], [allTags])

	const filteredPosts = useMemo(() => {
		if (selectedTag === '全部') return posts
		return posts.filter((post) => post.tags?.includes(selectedTag))
	}, [posts, selectedTag])

	const visiblePosts = filteredPosts.slice(0, visibleCount)
	const hasMore = visibleCount < filteredPosts.length

	const handleTagChange = (tag: string) => {
		setSelectedTag(tag)
		setVisibleCount(PAGE_SIZE)
	}

	return (
		<div className='w-full'>
			<nav
				aria-label='心得标签筛选'
				className='mt-8 flex flex-nowrap gap-2 overflow-x-auto no-scrollbar'
			>
				{tags.map((tag) => {
					const isActive = tag === selectedTag
					return (
						<button
							key={tag}
							type='button'
							onClick={() => handleTagChange(tag)}
							className={`shrink-0 whitespace-nowrap font-mono text-xs px-3 py-1 rounded-sm border transition-colors ${
								isActive
									? 'bg-skin-tag-bg text-skin-primary border-skin-primary'
									: 'text-skin-neutral-4 hover:text-skin-primary border-skin-card-border'
							}`}
						>
							{tag}
						</button>
					)
				})}
			</nav>

			<section className='mt-8'>
				{visiblePosts.length === 0 ? (
					<div className='text-center py-12 text-skin-neutral-5 font-mono text-sm'>暂无相关心得</div>
				) : (
					visiblePosts.map((post) => <StockCard key={post.id} post={post} />)
				)}
			</section>

			{hasMore && (
				<div className='mt-4 flex justify-center'>
					<button
						type='button'
						onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
						className='font-mono px-6 py-2 text-sm text-skin-neutral-3 border border-skin-card-border hover:text-skin-primary hover:border-skin-primary transition-colors'
					>
						加载更多 · load more
					</button>
				</div>
			)}
		</div>
	)
}
