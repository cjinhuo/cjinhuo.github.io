import IconPark, { NameTypes } from '../IconPark'

const NavList = [
  {
    label: 'Blog',
    href: '/blogs',
  },
  // {
  //   label: 'Resume',
  //   href: '/resume',
  // },
  {
    label: 'Github',
    href: 'https://github.com/cjinhuo',
    isBlank: true,
  },
]
interface TypeProps {
  pathname: string
}
export default function NavLink({ pathname }: TypeProps) {
  return (
    <>
      {NavList.map(item => {
        const isActive = pathname === item.href
        const textClassName = isActive ? 'text-skin-neutral-1' : 'text-skin-neutral-3'
        let label
        if (item.label === 'Github') {
          label = <IconPark name={NameTypes.github}></IconPark>
        }
        return (
          <a key={item.href} target={item.isBlank ? '_blank' : '_self'} href={item.href} className={`hover:text-skin-neutral-1 text-base ${textClassName}`}>
            {label || item.label}
          </a>
        )
      })}
    </>
  )
}
