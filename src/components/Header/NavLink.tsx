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
  },
]
interface TypeProps {
  pathname: string
}
export default function NavLink({ pathname }: TypeProps) {
  const onClickChangeTheme = () => {
    console.log('onClickChangeTheme')
  }
  return (
    <div className='flex gap-6'>
      {NavList.map(item => {
        const isActive = pathname === item.href
        return (
          <a key={item.href} href={item.href} className={`hover:text-skin-neutral-1 ${isActive ? 'text-skin-neutral-1' : 'text-skin-neutral-3'}`}>
            {item.label}
          </a>
        )
      })}
      <a href='#' className='text-skin-neutral-3 hover:text-skin-neutral-1' onClick={onClickChangeTheme}>
        切换
      </a>
    </div>
  )
}
