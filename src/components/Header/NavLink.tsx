const NavList = [
  {
    label: 'blog',
    href: '/blog',
  },
  {
    label: 'resume',
    href: '/resume',
  },
  {
    label: 'github',
    href: 'https://github.com/cjinhuo',
    icon: <iconpark-icon name='github-one'></iconpark-icon>,
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
        return (
          <a key={item.href} href={item.href} className={`hover:text-skin-neutral-1 ${isActive ? 'text-skin-neutral-1' : 'text-skin-neutral-3'}`}>
            {item.label}
          </a>
        )
      })}
    </>
  )
}
