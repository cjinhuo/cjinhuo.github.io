import type { BlogType, MarkdownInstance } from '@/types'
import dayjs from 'dayjs'
export default function BlogCard({ url, frontmatter }: MarkdownInstance<BlogType>) {
  const { pubDate, title, heroImage, heroImageAlt, description, author, authorHref } = frontmatter
  return (
    <div className=' w-full h-auto mb-6'>
      <a href={url} className='text-3xl font-semibold block mb-2 hover:underline'>
        {title}
      </a>
      <time className='font-semibold'>{dayjs(pubDate).format('MMMM DD,YYYY')}</time>
      {author && (
        <span className='italic mb-1'>
          ,by{' '}
          <a className='hover:underline' style={{ color: '#64a0fb;' }} href={authorHref} target='_blank'>
            {author}
          </a>
        </span>
      )}
      <p className='text-xl text-skin-neutral-3'>{description}</p>
    </div>
  )
}