export function initThemeFromLocalStorage() {
	const Dark = 'dark'
	const Light = 'light'
	const localStorageKey = '__shanks__theme'
	const addDarkToClassList = () => document.documentElement.classList.add(Dark)
	const removeDarkToClassList = () => document.documentElement.classList.remove(Dark)
	const media = window.matchMedia('(prefers-color-scheme: dark)')
	const colorSchemeChange = (e: any) => {
		if (e.matches) {
			localStorage.setItem(localStorageKey, Dark)
			addDarkToClassList()
		} else {
			localStorage.setItem(localStorageKey, Light)
			removeDarkToClassList()
		}
	}
	if (typeof media.addEventListener === 'function') media.addEventListener('change', colorSchemeChange)
	const theme = (() => {
		if (typeof localStorage !== 'undefined' && localStorage.getItem(localStorageKey)) {
			return localStorage.getItem(localStorageKey)
		}
		if (media.matches) {
			localStorage.setItem(localStorageKey, Dark)
			return Dark
		}
		return Light
	})()
	if (theme && theme === Dark) {
		addDarkToClassList()
	} else {
		removeDarkToClassList()
	}
}

export const getWordCount = (content: string) => {
	if (!content) return 0
	const text = content
		.replace(/```[\s\S]*?```/g, '')
		.replace(/`[^`]*`/g, '')
		.replace(/!\[.*?\]\(.*?\)/g, '')
		.replace(/<img[^>]*>/gi, '')
		.replace(/<video[^>]*>[\s\S]*?<\/video>/gi, '')
		.replace(/<audio[^>]*>[\s\S]*?<\/audio>/gi, '')
		.replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, '')
		.replace(/<svg[^>]*>[\s\S]*?<\/svg>/gi, '')
		.replace(/<canvas[^>]*>[\s\S]*?<\/canvas>/gi, '')
		.replace(/<[^>]+>/g, '')
		.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
		.replace(/[#*_~>`-]/g, '')
		.replace(/\n/g, ' ')
	const chineseChars = text.match(/[\u4e00-\u9fa5]/g) || []
	const englishWords = text
		.replace(/[\u4e00-\u9fa5]/g, ' ')
		.split(/\s+/)
		.filter((word) => word.length > 0)
	return chineseChars.length + englishWords.length
}
