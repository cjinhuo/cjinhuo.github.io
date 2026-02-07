import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import BlogCard from '@/components/BlogCard'
import FilterTags from './FilterTags'
import YearDropdown from './YearDropdown'

interface SerializedPost {
	id: string
	title: string
	description: string
	pubDate: string
	tags?: string[]
	author?: string
	authorHref?: string
}

interface SerializedMonth {
	month: number
	monthName: string
	posts: SerializedPost[]
}

interface SerializedYear {
	year: number
	months: SerializedMonth[]
	totalPosts: number
}

interface BlogTimelineProps {
	initialData: SerializedYear[]
	allTags: string[]
}

export default function BlogTimeline({ initialData, allTags }: BlogTimelineProps) {
	const [selectedTag, setSelectedTag] = useState('All')
	const [selectedYear, setSelectedYear] = useState<number | null>(null)
	const timelineRef = useRef<HTMLDivElement>(null)
	const yearRefs = useRef<Map<number, HTMLDivElement>>(new Map())

	const years = useMemo(() => initialData.map((y) => y.year), [initialData])

	const filteredData = useMemo(() => {
		let data = initialData as unknown as SerializedYear[]

		if (selectedTag !== 'All') {
			data = data
				.map((yearData) => ({
					...yearData,
					months: yearData.months
						.map((monthData) => ({
							...monthData,
							posts: monthData.posts.filter((post) => post.tags?.includes(selectedTag)),
						}))
						.filter((monthData) => monthData.posts.length > 0),
					totalPosts: yearData.months.reduce(
						(sum, m) => sum + m.posts.filter((p) => p.tags?.includes(selectedTag)).length,
						0
					),
				}))
				.filter((yearData) => yearData.totalPosts > 0)
		}

		if (selectedYear !== null) {
			data = data.filter((yearData) => yearData.year === selectedYear)
		}

		return data
	}, [initialData, selectedTag, selectedYear])

	const scrollToYear = useCallback((year: number) => {
		const yearElement = yearRefs.current.get(year)
		if (yearElement && timelineRef.current) {
			yearElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
		}
	}, [])

	useEffect(() => {
		if (selectedYear !== null) {
			scrollToYear(selectedYear)
		}
	}, [selectedYear, scrollToYear])

	const handleYearChange = (year: number | null) => {
		setSelectedYear(year)
	}

	const currentYear = new Date().getFullYear()

	return (
		<div className='w-full'>
			<div className='flex items-center gap-3 flex-wrap py-4 border-b border-skin-card-border'>
				<FilterTags tags={allTags} selectedTag={selectedTag} onTagChange={setSelectedTag} />
				<div className='w-px h-5 bg-skin-card-border' />
				<YearDropdown years={years} selectedYear={selectedYear} onYearChange={handleYearChange} />
			</div>

			<div ref={timelineRef} className='pt-8'>
				{filteredData.length === 0 ? (
					<div className='text-center py-12 text-skin-neutral-5 font-mono text-sm'>No posts found</div>
				) : (
					<div className='space-y-0'>
						{filteredData.map((yearData, yearIndex) => {
							const isCurrentYear = yearData.year === currentYear
							const isFirstYear = yearIndex === 0

							return (
								<div
									key={yearData.year}
									ref={(el) => {
										if (el) yearRefs.current.set(yearData.year, el)
									}}
									className='relative'
								>
									<div>
										{!isFirstYear && (
											<div className='flex'>
												<div className='w-10 flex justify-center shrink-0'>
													<div className='w-0.5 h-4 bg-skin-card-border' />
												</div>
											</div>
										)}
										<div className='flex items-center'>
											<div className='w-10 flex justify-center shrink-0'>
												<div
													className={`w-3 h-3 rounded-full ${isCurrentYear ? 'bg-skin-primary' : 'bg-skin-neutral-5'}`}
												/>
											</div>
											<h2
												className={`text-2xl font-bold ${
													isCurrentYear ? 'text-skin-neutral-1' : 'text-skin-neutral-4'
												}`}
											>
												{yearData.year}
											</h2>
											<span
												className={`font-mono text-xs ml-4 ${
													isCurrentYear ? 'text-skin-neutral-5' : 'text-skin-neutral-6'
												}`}
											>
												{yearData.totalPosts} {yearData.totalPosts === 1 ? 'post' : 'posts'}
											</span>
										</div>

										{yearData.months.map((monthData) => (
											<div key={monthData.month}>
												<div className='flex'>
													<div className='w-10 flex justify-center shrink-0'>
														<div className='w-0.5 h-4 bg-skin-card-border' />
													</div>
												</div>
												<div className='flex items-center'>
													<div className='w-10 flex justify-center shrink-0'>
														<div
															className={`w-2 h-2 rounded-full ${
																isCurrentYear ? 'bg-skin-primary' : 'bg-skin-neutral-5'
															}`}
														/>
													</div>
													<h3
														className={`font-mono text-sm font-semibold ${
															isCurrentYear ? 'text-skin-primary' : 'text-skin-neutral-5'
														}`}
													>
														{monthData.monthName}
													</h3>
												</div>
												<div className='flex'>
													<div className='w-10 flex justify-center shrink-0'>
														<div className='w-0.5 h-full bg-skin-card-border' />
													</div>
													<div className='flex-1 py-4 space-y-6'>
														{monthData.posts.map((post) => (
															<BlogCard
																key={post.id}
																id={post.id}
																title={post.title}
																description={post.description}
																author={post.author}
																authorHref={post.authorHref}
																pubDate={post.pubDate}
																tags={post.tags}
															/>
														))}
													</div>
												</div>
											</div>
										))}
									</div>
								</div>
							)
						})}
					</div>
				)}
			</div>
		</div>
	)
}
