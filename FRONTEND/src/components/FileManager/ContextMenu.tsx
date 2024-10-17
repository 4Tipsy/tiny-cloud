
import { useEffect, useRef } from "react"




type menuOption = {
  label: string,
  handler: Function,
}

type contextMenuType = {
  cords: [number, number]
  isOpened: boolean,
  setIsOpened: Function,
  menuOptions: menuOption[],
}





const ContextMenu = ({cords, isOpened, setIsOpened, menuOptions}: contextMenuType) => {



    const itRef = useRef<HTMLDivElement>(null) // ref to this component as Node
    useEffect(() => {



      const _click_outside = (event: MouseEvent) => {
        if (itRef.current && !itRef.current.contains(event.target as Node)) {
          setIsOpened(false)
        }
      }
  
      const _esc = (e: KeyboardEvent) => {
        if (e.key == "Escape") setIsOpened(false)
      }



      window.addEventListener('keydown', _esc)
      window.addEventListener('mousedown', _click_outside);
      return () => {
        window.removeEventListener('mousedown', _click_outside)
        window.removeEventListener('keydown', _esc)
      }
  
    }, [])





  return (
    <>{
      isOpened &&
      <div
      className="fixed z-10 bg-main-2 border-main-3 border-[2px]  overflow-hidden rounded"
      style={{left: cords[0]+'px', top: cords[1]+'px'}}
      ref={itRef}
      >

        {
          menuOptions.map(({label, handler}) => { return (
            <div className="pl-4 pr-10 py-1 cursor-pointer border-t-[1px] first:border-t-0 border-main-3 hover:bg-main-3"
            key={label}
            onClick={ e => {e.stopPropagation(); handler()} }
            >{label}</div>
          )})
        }


      </div>
    }</>
  )
}



export { ContextMenu }