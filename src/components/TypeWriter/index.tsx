import './index.css'
import typed from 'typed.js'
import { useEffect, useRef } from 'react'
const TypedCursorClassName = 'typed-cursor'
export default function TypeWriter() {
  const nameTypedDom = useRef<HTMLDivElement>(null)
  const descriptionTypedDom = useRef<HTMLDivElement>(null)
  const startDescriptionTyped = () => {
    if (descriptionTypedDom.current) {
      new typed(descriptionTypedDom.current, {
        strings: ['I like designing SDK architecture and really into new tech things. ^1000 Now focusing on Monitoring of Web and Mini Program at Bytedance.'],
        typeSpeed: 30,
        loop: false,
      })
      setTimeout(() => {
        const lastElement = descriptionTypedDom.current?.parentElement?.lastElementChild
        lastElement && lastElement?.classList.contains(TypedCursorClassName) && descriptionTypedDom.current?.parentElement?.removeChild(lastElement)
      }, 8000)
    }
  }
  useEffect(() => {
    if (nameTypedDom.current) {
      new typed(nameTypedDom.current, {
        strings: ["Hey, I'm cjinhuo.", "Hey, I'm Shanks."],
        typeSpeed: 50,
        backSpeed: 36,
        smartBackspace: true,
        loop: false,
      })
      setTimeout(() => {
        const lastElement = nameTypedDom.current?.parentElement?.lastElementChild
        lastElement && lastElement?.classList.contains(TypedCursorClassName) && nameTypedDom.current?.parentElement?.removeChild(lastElement)
        startDescriptionTyped()
      }, 4000)
    }
  }, [nameTypedDom])
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <div>
        <div className='inline w-auto text-skin-neutral-1 text-2xl font-mono font-semibold antialiased typed-name' ref={nameTypedDom}></div>
      </div>
      <div>
        <div className='inline w-auto text-skin-neutral-3 font-mono' ref={descriptionTypedDom}></div>
      </div>
    </div>
  )
}
