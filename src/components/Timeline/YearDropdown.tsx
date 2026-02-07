import { useState, useRef, useEffect, useCallback } from 'react'

interface YearDropdownProps {
	years: number[]
	selectedYear: number | null
	onYearChange: (year: number | null) => void
}

export default function YearDropdown({ years, selectedYear, onYearChange }: YearDropdownProps) {
	const [isOpen, setIsOpen] = useState(false)
	const dropdownRef = useRef<HTMLDivElement>(null)

	const handleClickOutside = useCallback((event: MouseEvent) => {
		if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
			setIsOpen(false)
		}
	}, [])

	useEffect(() => {
		if (isOpen) {
			document.addEventListener('click', handleClickOutside)
			return () => document.removeEventListener('click', handleClickOutside)
		}
	}, [isOpen, handleClickOutside])

	const displayText = selectedYear ?? 'All'

	return (
		<div ref={dropdownRef} className='relative'>
			<button
				type='button'
				onClick={() => setIsOpen(!isOpen)}
				className='flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-skin-card-bg border border-skin-card-border hover:border-skin-primary transition-colors'
			>
				<svg
					className='w-3 h-3 text-skin-neutral-5'
					fill='none'
					stroke='currentColor'
					viewBox='0 0 24 24'
					aria-hidden='true'
				>
					<rect x='3' y='4' width='18' height='18' rx='2' ry='2' strokeWidth='2' />
					<line x1='16' y1='2' x2='16' y2='6' strokeWidth='2' />
					<line x1='8' y1='2' x2='8' y2='6' strokeWidth='2' />
					<line x1='3' y1='10' x2='21' y2='10' strokeWidth='2' />
				</svg>
				<span className='font-mono text-xs text-skin-neutral-4'>{displayText}</span>
				<svg
					className={`w-2.5 h-2.5 text-skin-neutral-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
					fill='none'
					stroke='currentColor'
					viewBox='0 0 24 24'
					aria-hidden='true'
				>
					<polyline points='6 9 12 15 18 9' strokeWidth='2' />
				</svg>
			</button>

			{isOpen && (
				<div className='absolute top-full left-0 mt-1 min-w-[100px] bg-skin-card-bg border border-skin-card-border rounded shadow-lg z-50'>
					<button
						type='button'
						onClick={() => {
							onYearChange(null)
							setIsOpen(false)
						}}
						className={`w-full px-3 py-2 text-left font-mono text-xs transition-colors ${
							selectedYear === null ? 'text-skin-primary bg-skin-tag-bg' : 'text-skin-neutral-4 hover:bg-skin-tag-bg'
						}`}
					>
						All
					</button>
					{years.map((year) => (
						<button
							key={year}
							type='button'
							onClick={() => {
								onYearChange(year)
								setIsOpen(false)
							}}
							className={`w-full px-3 py-2 text-left font-mono text-xs transition-colors ${
								selectedYear === year ? 'text-skin-primary bg-skin-tag-bg' : 'text-skin-neutral-4 hover:bg-skin-tag-bg'
							}`}
						>
							{year}
						</button>
					))}
				</div>
			)}
		</div>
	)
}
