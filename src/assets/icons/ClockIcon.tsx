interface Props {
	className?: string
}

export default function ClockIcon({ className = '' }: Props) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width='14'
			height='14'
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
			className={className}
			aria-hidden='true'
		>
			<circle cx='12' cy='12' r='10' />
			<polyline points='12 6 12 12 16 14' />
		</svg>
	)
}
