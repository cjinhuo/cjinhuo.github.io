import dayjs from 'dayjs'

export interface StockTrade {
	changePercent?: string
	profit?: string
	buyPrice?: string
	sellPrice?: string
	symbol?: string
	related?: string
}

export interface StockCardData {
	id: string
	title: string
	description: string
	pubDate: string
	tags?: string[]
	body?: string
	trade?: StockTrade
	readingTime: number
}

function isPositive(value: string): boolean {
	return !value.trim().startsWith('-')
}

function tradeColorClass(value: string): string {
	return isPositive(value) ? 'text-skin-market-up' : 'text-skin-market-down'
}

interface StockCardProps {
	post: StockCardData
}

export default function StockCard({ post }: StockCardProps) {
	const { id, title, description, pubDate, tags, trade, readingTime } = post
	const url = `/stock/${id}`
	const primaryTag = tags?.[0]
	const secondaryTag = tags?.[1]

	return (
		<a
			href={url}
			className='group block p-6 mb-6 bg-skin-card-bg border border-skin-card-border border-l-2 hover:border-l-skin-primary transition-colors'
		>
			<div className='flex items-center justify-between gap-3'>
				<div className='flex items-center gap-2 font-mono text-xs text-skin-neutral-5 min-w-0'>
					<span className='whitespace-nowrap'>{dayjs(pubDate).format('YYYY.MM.DD')}</span>
					{readingTime > 0 && (
						<>
							<span aria-hidden='true'>·</span>
							<span className='whitespace-nowrap'>{readingTime} min read</span>
						</>
					)}
				</div>
				{(primaryTag || secondaryTag) && (
					<div className='flex items-center gap-2 shrink-0'>
						{primaryTag && (
							<span className='inline-flex items-center whitespace-nowrap text-xs px-2 py-0.5 rounded-sm bg-skin-tag-bg text-skin-tag-text font-mono'>
								{primaryTag}
							</span>
						)}
						{secondaryTag && (
							<span className='hidden sm:inline-flex items-center whitespace-nowrap text-xs px-2 py-0.5 rounded-sm bg-skin-tag-bg text-skin-tag-text font-mono'>
								{secondaryTag}
							</span>
						)}
					</div>
				)}
			</div>

			<h2 className='mt-3 text-lg font-semibold text-skin-neutral-1 group-hover:text-skin-primary transition-colors truncate'>
				{title}
			</h2>
			<p className='mt-2 text-sm text-skin-neutral-4 line-clamp-3'>{description}</p>

			{trade && (trade.changePercent || trade.profit) && (
				<div className='mt-4 flex items-center gap-3 flex-wrap font-mono'>
					{trade.changePercent && (
						<span className='flex items-baseline gap-1.5 whitespace-nowrap px-2 py-1 rounded-sm bg-skin-tag-bg'>
							<span className='text-[10px] uppercase tracking-wider text-skin-neutral-5'>涨跌幅</span>
							<span className={`text-sm font-semibold ${tradeColorClass(trade.changePercent)}`}>
								{trade.changePercent}
							</span>
						</span>
					)}
					{trade.profit && (
						<span className='flex items-baseline gap-1.5 whitespace-nowrap px-2 py-1 rounded-sm bg-skin-tag-bg'>
							<span className='text-[10px] uppercase tracking-wider text-skin-neutral-5'>盈亏</span>
							<span className={`text-sm font-semibold ${tradeColorClass(trade.profit)}`}>{trade.profit}</span>
						</span>
					)}
				</div>
			)}

			<div className='h-px bg-skin-card-border mt-4 mb-3' />

			<div className='flex items-center justify-between gap-3'>
				<span className='font-mono text-xs text-skin-neutral-5 truncate'>
					{trade?.related ? `关联 · ${trade.related}` : ' '}
				</span>
				<span className='font-mono text-xs text-skin-primary whitespace-nowrap shrink-0'>阅读全文 →</span>
			</div>
		</a>
	)
}
