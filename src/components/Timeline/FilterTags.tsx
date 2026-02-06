interface FilterTagsProps {
	tags: string[]
	selectedTag: string
	onTagChange: (tag: string) => void
}

export default function FilterTags({ tags, selectedTag, onTagChange }: FilterTagsProps) {
	const allTags = ['All', ...tags]

	return (
		<div className="flex items-center gap-3 flex-wrap">
			{allTags.map((tag) => {
				const isSelected = tag === selectedTag
				return (
					<button
						key={tag}
						type="button"
						onClick={() => onTagChange(tag)}
						className={`px-3 py-1.5 rounded-sm font-mono text-xs font-medium transition-colors ${
							isSelected
								? 'bg-skin-primary text-skin-neutral-10 font-bold'
								: 'bg-skin-card-bg text-skin-primary hover:bg-skin-tag-bg'
						}`}
					>
						{tag}
					</button>
				)
			})}
		</div>
	)
}
