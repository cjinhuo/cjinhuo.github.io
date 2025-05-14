import IconPark, { NameTypes } from '../IconPark'

const NavList = [
  {
    label: 'Blog',
    href: '/blogs',
  },
  {
    label: 'Resume',
    href: '/resume',
    icon: NameTypes.Resume,
  },
  {
    label: 'Github',
    icon: NameTypes.Github,
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
      {NavList.map((item) => {
        const isActive = pathname === item.href
        const textClassName = isActive ? 'text-skin-neutral-1' : 'text-skin-neutral-5'
        let label
        if (item.icon) {
          label = <IconPark className={`hover:text-skin-neutral-1 ${textClassName}`} name={item.icon}></IconPark>
        }
        return (
          <a
            key={item.href}
            target={item.isBlank ? '_blank' : '_self'}
            href={item.href}
            title={item.label}
            aria-label={item.label}
            rel={item.isBlank ? "noopener noreferrer" : undefined}
            className={`hover:text-skin-neutral-1 transition duration-75 text-base ${textClassName}`}>
            {label || item.label}
          </a>
        )
      })}
    </>
  )
}
