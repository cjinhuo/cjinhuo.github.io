import dayjs from 'dayjs'
import CalendarIcon from '@/assets/icons/CalendarIcon'
import ClockIcon from '@/assets/icons/ClockIcon'
import DocumentIcon from '@/assets/icons/DocumentIcon'
import UserIcon from '@/assets/icons/UserIcon'
import { getWordCount } from '@/shared/utils'

interface BlogCardProps {
	id: string
	title: string
	description: string
	pubDate: string
	tags?: string[]
	author?: string
	authorHref?: string
	body?: string
	onPointerEnter?: () => void
	onPointerLeave?: () => void
}

export default function BlogCard({
	id,
	title,
	description,
	pubDate,
	tags,
	author,
	authorHref,
	body,
	onPointerEnter,
	onPointerLeave,
}: BlogCardProps) {
	const url = `/blogs/${id}`
	const wordCount = getWordCount(body ?? '')
	const readingTime = Math.ceil(wordCount / 400)

	return (
		<div
			className='w-full h-auto p-6 bg-skin-card-bg border border-skin-card-border border-l-2 hover:border-l-skin-primary transition-colors'
			onPointerEnter={onPointerEnter}
			onPointerLeave={onPointerLeave}
		>
			<a href={url} className='text-lg text-skin-neutral-1 font-semibold block mb-4 hover:underline'>
				{title}
			</a>
			<div className='flex items-center flex-wrap gap-x-2 md:gap-x-4 mb-4'>
				<div className='flex items-center gap-2'>
					<CalendarIcon className='text-skin-neutral-6' />
					<time className='font-mono text-xs text-skin-neutral-6'>{dayjs(pubDate).format('YYYY-MM-DD')}</time>
				</div>
				{author && (
					<div className='flex items-center gap-2'>
						<UserIcon className='text-skin-neutral-6' />
						<a
							className='font-mono text-xs text-skin-neutral-5 hover:underline'
							href={authorHref}
							target='_blank'
							rel='noopener noreferrer'
						>
							{author}
						</a>
					</div>
				)}
				{wordCount > 0 && (
					<div className='flex items-center gap-2'>
						<DocumentIcon className='text-skin-neutral-6' />
						<span className='font-mono text-xs text-skin-neutral-6'>{wordCount.toLocaleString()} 字</span>
					</div>
				)}
				{readingTime > 0 && (
					<div className='flex items-center gap-2'>
						<ClockIcon className='text-skin-neutral-6' />
						<span className='font-mono text-xs text-skin-neutral-6'>约 {readingTime} min</span>
					</div>
				)}
			</div>
			{tags && tags.length > 0 && (
				<div className='flex flex-wrap gap-2 mb-4'>
					{tags.map((tag) => (
						<span
							key={tag}
							className='inline-flex items-center px-2 py-1 text-xs font-bold bg-skin-tag-bg text-skin-tag-text font-mono'
						>
							{tag}
						</span>
					))}
				</div>
			)}
			<p className='text-xs text-skin-neutral-4 font-mono leading-relaxed'>{description}</p>
		</div>
	)
}
