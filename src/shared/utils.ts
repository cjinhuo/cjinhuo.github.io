export function initThemeFromLocalStorage() {
  const Dark = 'dark'
  const Light = 'light'
  const localStorageKey = '__shanks__theme'
  const addDarkToClassList = () => document.documentElement.classList.add(Dark)
  const removeDarkToClassList = () => document.documentElement.classList.remove(Dark)
  const media = window.matchMedia('(prefers-color-scheme: dark)')
  const colorSchemeChange = (e:any) => {
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
