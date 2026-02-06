import dayjs from 'dayjs'

interface BlogCardProps {
	id: string
	title: string
	description: string
	pubDate: string
	tags?: string[]
	author?: string
	authorHref?: string
}

export default function BlogCard({ id, title, description, pubDate, tags, author, authorHref }: BlogCardProps) {
	const url = `/blogs/${id}`

	return (
		<div className="w-full h-auto p-6 bg-skin-card-bg border border-skin-card-border border-l-2 hover:border-l-skin-primary transition-colors">
			<a href={url} className="text-lg text-skin-neutral-1 font-semibold block mb-4 hover:underline">
				{title}
			</a>
			<div className="flex items-center flex-wrap gap-x-4 mb-4">
				<div className="flex items-center gap-2">
					<svg className="w-4 h-4 text-skin-neutral-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
						<rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2" />
						<line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" />
						<line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" />
						<line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" />
					</svg>
					<time className="font-mono text-xs text-skin-neutral-6">
						{dayjs(pubDate).format('YYYY-MM-DD')}
					</time>
				</div>
				{author && (
					<div className="flex items-center gap-2">
						<svg className="w-4 h-4 text-skin-neutral-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
							<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeWidth="2" />
							<circle cx="12" cy="7" r="4" strokeWidth="2" />
						</svg>
						<a
							className="font-mono text-xs text-skin-neutral-5 hover:underline"
							href={authorHref}
							target="_blank"
							rel="noopener noreferrer"
						>
							{author}
						</a>
					</div>
				)}
			</div>
			{tags && tags.length > 0 && (
				<div className="flex flex-wrap gap-2 mb-4">
					{tags.map((tag) => (
						<span
							key={tag}
							className="inline-flex items-center px-2 py-1 text-xs font-bold bg-skin-tag-bg text-skin-tag-text font-mono"
						>
							{tag}
						</span>
					))}
				</div>
			)}
			<p className="text-xs text-skin-neutral-4 font-mono leading-relaxed">{description}</p>
		</div>
	)
}
