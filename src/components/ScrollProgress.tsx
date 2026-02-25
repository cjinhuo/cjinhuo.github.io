import { useEffect, useState } from 'react'

export default function ScrollProgress() {
	const [progress, setProgress] = useState(0)

	useEffect(() => {
		let ticking = false

		const calculateProgress = () => {
			const scrollY = window.scrollY
			const documentHeight = document.documentElement.scrollHeight
			const windowHeight = window.innerHeight
			const scrollableHeight = documentHeight - windowHeight

			if (scrollableHeight <= 0) return 0

			return Math.min(100, (scrollY / scrollableHeight) * 100)
		}

		const handleScroll = () => {
			if (!ticking) {
				requestAnimationFrame(() => {
					setProgress(calculateProgress())
					ticking = false
				})
				ticking = true
			}
		}

		window.addEventListener('scroll', handleScroll, { passive: true })
		handleScroll()

		return () => {
			window.removeEventListener('scroll', handleScroll)
		}
	}, [])

	return (
		<div className='fixed top-0 left-0 right-0 z-50 h-1 bg-skin-neutral-8'>
			<div
				className='h-full bg-skin-primary transition-all duration-150 ease-out'
				style={{ width: `${progress}%` }}
			/>
		</div>
	)
}
