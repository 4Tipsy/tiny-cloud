
import clsx from "clsx"
import { useLocation } from "wouter"
import { useEffect } from "react"





const HotkeysModal = () => {

  const [_, setLocation] = useLocation()


  useEffect(() => {

    const _f = (e: KeyboardEvent) => {
      if (e.key == "Escape") setLocation('/', {replace: true})
    }
    window.addEventListener('keydown', _f)
    return () => window.removeEventListener('keydown', _f)
  }, [])






  return (
    <div className="bg-shading absolute w-full h-full center-div  z-40"
    onClick={_ => setLocation('/', {replace: true})}>



      <div className={clsx(
        "hotkeys bg-shading relative",
        "before:content-['[tap_outside_to_close]'] before:text-lg before:absolute before:translate-y-[-115%] before:right-3"
        )}
        onClick={e => e.stopPropagation()}>
        
        <div className="flex flex-col text-2xl p-6">
          <div> <span className="text-highlight">Backspace</span> = go to parent folder </div>
          <div> <span className="text-highlight">Shift</span> = change view_mode of FsManager </div>
          <div> <span className="text-highlight">Esc</span> = close any modal frame </div>
          <div> <span className="text-highlight">Ctrl + M</span> = create new directory (in current dir) </div>
          <div> <span className="text-highlight">Ctrl + U</span> = open user profile settings</div>
          <div> <span className="text-highlight">Del</span> = reload current folder contents</div>
        </div>

      </div>



    </div>
  )
}



export { HotkeysModal }