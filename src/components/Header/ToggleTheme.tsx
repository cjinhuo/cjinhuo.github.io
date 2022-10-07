import { PREFIX } from '@/constants'
import { useEffect, useState } from 'react'
import IconPark, { NameTypes } from '../IconPark'

export default function ToggleTheme() {
  const [theme, setTheme] = useState(NameTypes.sun)
  useEffect(() => {
    const item = localStorage.getItem(`${PREFIX}theme`)
    if (item) {
      item === NameTypes.sun ? setTheme(NameTypes.sun) : setTheme(NameTypes.moon)
    }
  }, [])

  useEffect(() => {
    if (theme === NameTypes.moon) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  const onClickToggleTheme = () => {
    let currentTheme = NameTypes.sun
    if (theme === NameTypes.sun) {
      currentTheme = NameTypes.moon
    } else {
      currentTheme = NameTypes.sun
    }
    localStorage.setItem(`${PREFIX}theme`, currentTheme)
    setTheme(currentTheme)
  }
  return (
    <div>
      <IconPark onClick={onClickToggleTheme} className='text-skin-neutral-3 hover:text-skin-neutral-1 hover:cursor-pointer' name={theme}></IconPark>
      {/* <iconpark-icon name='moon'></iconpark-icon> */}
    </div>
  )
}
