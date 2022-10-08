import type { BlogType, MarkdownInstance } from '@/types'
import dayjs from 'dayjs'
export default function BlogCard({ url, frontmatter }: MarkdownInstance<BlogType>) {
  const { pubDate, title, heroImage, heroImageAlt, description, author, authorHref } = frontmatter
  return (
    <div className='w-full h-auto mb-6'>
      <a href={url} className='text-2xl text-skin-neutral-1 font-semibold block mb-2 hover:underline'>
        {title}
      </a>
      <time className='font-semibold text-skin-neutral-3'>{dayjs(pubDate).format('MMMM DD,YYYY')}</time>
      {author && (
        <span className='text-skin-neutral-3 italic mb-1'>
          ,by{' '}
          <a className='hover:underline text-skin-link' href={authorHref} target='_blank'>
            {author}
          </a>
        </span>
      )}
      <p className='text-sm text-skin-neutral-4'>{description}</p>
    </div>
  )
}
