import { PREFIX } from '@/shared'
import { useEffect, useState } from 'react'
import IconPark, { NameTypes } from '../IconPark'

export default function ToggleTheme() {
  const [theme, setTheme] = useState(NameTypes.Dark)
  useEffect(() => {
    const item = localStorage.getItem(`${PREFIX}theme`)
    if (item) {
      item === NameTypes.Light ? setTheme(NameTypes.Light) : setTheme(NameTypes.Dark)
    }
  }, [])

  const removeDocumentClassWithType = (theme: NameTypes) => {
    if (theme === NameTypes.Dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const onClickToggleTheme = () => {
    let currentTheme = NameTypes.Light
    if (theme === NameTypes.Light) {
      currentTheme = NameTypes.Dark
    } else {
      currentTheme = NameTypes.Light
    }
    localStorage.setItem(`${PREFIX}theme`, currentTheme)
    setTheme(currentTheme)
    removeDocumentClassWithType(currentTheme)
  }
  return (
    <div>
      <IconPark
        onClick={onClickToggleTheme}
        title='Toggle Theme'
        className='text-skin-neutral-5 hover:text-skin-neutral-1 hover:cursor-pointer'
        name={theme}></IconPark>
    </div>
  )
}
