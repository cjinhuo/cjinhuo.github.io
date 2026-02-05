import dayjs from 'dayjs'
import type { BlogCardProps } from '@/types'
import Tag from './Tag'

export default function BlogCard({ url, frontmatter }: BlogCardProps) {
	const { pubDate, title, description, author, authorHref, tags } = frontmatter
	return (
		<div className="w-full h-auto mb-6 p-6 bg-skin-card-bg border border-skin-card-border border-l-2 hover:border-l-skin-primary transition-colors">
			<a href={url} className='text-lg text-skin-neutral-1 font-semibold block mb-4 hover:underline'>
				{title}
			</a>
			<div className='flex items-center flex-wrap gap-x-4 mb-4'>
				<time className='font-mono text-xs text-skin-neutral-6'>{dayjs(pubDate).format('YYYY-MM-DD')}</time>
				{author && (
					<span className='font-mono text-xs text-skin-neutral-5'>
						<a className='hover:underline' href={authorHref} target='_blank'>
							{author}
						</a>
					</span>
				)}
			</div>
			<Tag tags={tags} className='mb-4' />
			<p className='text-xs text-skin-neutral-4 font-mono leading-relaxed'>{description}</p>
		</div>
	)
}
