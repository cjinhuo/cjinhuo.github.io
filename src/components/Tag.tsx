interface TagProps {
	tags?: string[]
	className?: string
}

export default function Tag({ tags, className = '' }: TagProps) {
	if (!tags || tags.length === 0) return null

	return (
		<div className={`flex flex-wrap gap-2 ${className}`}>
			{tags.map((tag) => (
				<span
					key={tag}
					className='inline-flex items-center px-2 py-1 text-xs font-bold bg-skin-tag-bg text-skin-tag-text font-mono'
				>
					{tag}
				</span>
			))}
		</div>
	)
}
