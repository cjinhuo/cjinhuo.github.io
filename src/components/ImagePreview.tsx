import { useCallback, useEffect, useRef, useState } from 'react'

interface ImagePreviewProps {
	containerSelector?: string
}

const MIN_SCALE = 0.5
const MAX_SCALE = 3
const SCALE_STEP = 0.25

export default function ImagePreview({ containerSelector = '.prose' }: ImagePreviewProps) {
	const [isOpen, setIsOpen] = useState(false)
	const [imageUrl, setImageUrl] = useState('')
	const [scale, setScale] = useState(1)
	const [rotation, setRotation] = useState(0)
	const imageRef = useRef<HTMLImageElement>(null)

	const handleOpen = useCallback((url: string) => {
		setImageUrl(url)
		setScale(1)
		setRotation(0)
		setIsOpen(true)
		document.body.style.overflow = 'hidden'
	}, [])

	const handleClose = useCallback(() => {
		setIsOpen(false)
		setImageUrl('')
		setScale(1)
		setRotation(0)
		document.body.style.overflow = ''
	}, [])

	const handleZoomIn = useCallback(() => {
		setScale((prev) => Math.min(prev + SCALE_STEP, MAX_SCALE))
	}, [])

	const handleZoomOut = useCallback(() => {
		setScale((prev) => Math.max(prev - SCALE_STEP, MIN_SCALE))
	}, [])

	const handleReset = useCallback(() => {
		setScale(1)
		setRotation(0)
	}, [])

	const handleRotateLeft = useCallback(() => {
		setRotation((prev) => prev - 90)
	}, [])

	const handleRotateRight = useCallback(() => {
		setRotation((prev) => prev + 90)
	}, [])

	const handleWheel = useCallback((e: React.WheelEvent) => {
		e.preventDefault()
		if (e.deltaY < 0) {
			setScale((prev) => Math.min(prev + SCALE_STEP, MAX_SCALE))
		} else {
			setScale((prev) => Math.max(prev - SCALE_STEP, MIN_SCALE))
		}
	}, [])

	const handleBackdropClick = useCallback(
		(e: React.MouseEvent) => {
			if (e.target === e.currentTarget) {
				handleClose()
			}
		},
		[handleClose]
	)

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && isOpen) {
				handleClose()
			}
		}
		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [isOpen, handleClose])

	useEffect(() => {
		const handleImageClick = (e: Event) => {
			const target = e.target as HTMLElement
			if (target.tagName === 'IMG') {
				const img = target as HTMLImageElement
				const src = img.src || img.dataset.src
				if (src) {
					e.preventDefault()
					handleOpen(src)
				}
			}
		}

		const container = document.querySelector(containerSelector)
		if (container) {
			const images = container.querySelectorAll('img')
			for (const img of images) {
				img.style.cursor = 'pointer'
			}
			container.addEventListener('click', handleImageClick)
			return () => {
				for (const img of images) {
					img.style.cursor = ''
				}
				container.removeEventListener('click', handleImageClick)
			}
		}
	}, [containerSelector, handleOpen])

	if (!isOpen) return null

	return (
		<div
			role='dialog'
			aria-modal='true'
			aria-label='图片预览'
			className='fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm'
			onClick={handleBackdropClick}
			onWheel={handleWheel}
		>
			<div className='relative max-w-[90vw] max-h-[90vh] flex flex-col items-center'>
				<img
					ref={imageRef}
					src={imageUrl}
					alt='Preview'
					className='max-w-full max-h-[80vh] object-contain transition-transform duration-200'
					style={{ transform: `scale(${scale}) rotate(${rotation}deg)` }}
					draggable={false}
				/>
				<div className='mt-4 flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-full px-4 py-2'>
					<button
						type='button'
						onClick={handleZoomOut}
						disabled={scale <= MIN_SCALE}
						className='w-8 h-8 flex items-center justify-center rounded-full text-white hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors'
						title='缩小'
					>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 0 24 24'
							fill='none'
							stroke='currentColor'
							strokeWidth='2'
							className='w-5 h-5'
							aria-hidden='true'
						>
							<title>缩小图标</title>
							<circle cx='11' cy='11' r='8' />
							<path d='m21 21-4.35-4.35' />
							<path d='M8 11h6' />
						</svg>
					</button>
					<span className='text-white text-sm font-mono min-w-[3.5rem] text-center'>{Math.round(scale * 100)}%</span>
					<button
						type='button'
						onClick={handleZoomIn}
						disabled={scale >= MAX_SCALE}
						className='w-8 h-8 flex items-center justify-center rounded-full text-white hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors'
						title='放大'
					>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 0 24 24'
							fill='none'
							stroke='currentColor'
							strokeWidth='2'
							className='w-5 h-5'
							aria-hidden='true'
						>
							<title>放大图标</title>
							<circle cx='11' cy='11' r='8' />
							<path d='m21 21-4.35-4.35' />
							<path d='M11 8v6' />
							<path d='M8 11h6' />
						</svg>
					</button>
					<div className='w-px h-5 bg-white/30' />
					<button
						type='button'
						onClick={handleRotateLeft}
						className='w-8 h-8 flex items-center justify-center rounded-full text-white hover:bg-white/20 transition-colors'
						title='向左旋转'
					>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 0 24 24'
							fill='none'
							stroke='currentColor'
							strokeWidth='2'
							className='w-5 h-5'
							aria-hidden='true'
						>
							<title>向左旋转图标</title>
							<path d='M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8' />
							<path d='M3 3v5h5' />
						</svg>
					</button>
					<button
						type='button'
						onClick={handleRotateRight}
						className='w-8 h-8 flex items-center justify-center rounded-full text-white hover:bg-white/20 transition-colors'
						title='向右旋转'
					>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 0 24 24'
							fill='none'
							stroke='currentColor'
							strokeWidth='2'
							className='w-5 h-5'
							aria-hidden='true'
						>
							<title>向右旋转图标</title>
							<path d='M21 12a9 9 0 1 1-9-9 9.75 9.75 0 0 1 6.74 2.74L21 8' />
							<path d='M21 3v5h-5' />
						</svg>
					</button>
					<div className='w-px h-5 bg-white/30' />
					<button
						type='button'
						onClick={handleReset}
						className='w-8 h-8 flex items-center justify-center rounded-full text-white hover:bg-white/20 transition-colors'
						title='重置'
					>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 0 24 24'
							fill='none'
							stroke='currentColor'
							strokeWidth='2'
							className='w-5 h-5'
							aria-hidden='true'
						>
							<title>重置图标</title>
							<path d='M12 3v3m0 12v3M3 12h3m12 0h3' />
							<circle cx='12' cy='12' r='4' />
						</svg>
					</button>
					<button
						type='button'
						onClick={handleClose}
						className='w-8 h-8 flex items-center justify-center rounded-full text-white hover:bg-white/20 transition-colors'
						title='关闭'
					>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 0 24 24'
							fill='none'
							stroke='currentColor'
							strokeWidth='2'
							className='w-5 h-5'
							aria-hidden='true'
						>
							<title>关闭图标</title>
							<path d='M18 6 6 18' />
							<path d='m6 6 12 12' />
						</svg>
					</button>
				</div>
			</div>
		</div>
	)
}
