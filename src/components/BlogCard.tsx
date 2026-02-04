import dayjs from 'dayjs'
import type { BlogCardProps } from '@/types'
import Tag from './Tag'

export default function BlogCard({ url, frontmatter }: BlogCardProps) {
	const { pubDate, title, description, author, authorHref, tags } = frontmatter
	return (
		<div className='w-full h-auto mb-6'>
			<a href={url} className='text-2xl text-skin-neutral-1 font-semibold block mb-2 hover:underline'>
				{title}
			</a>
			<div className='flex items-center flex-wrap gap-x-2 mb-1'>
				<time className='font-semibold text-skin-neutral-3'>{dayjs(pubDate).format('MMMM DD,YYYY')}</time>
				{author && (
					<span className='text-skin-neutral-3 italic'>
						,by{' '}
						<a className='hover:underline text-skin-link' href={authorHref} target='_blank'>
							{author}
						</a>
					</span>
				)}
			</div>
			<Tag tags={tags} className='mb-2' />
			<p className='text-sm text-skin-neutral-4'>{description}</p>
		</div>
	)
}
