
import clsx from "clsx"
import { useAtomValue, useSetAtom } from "jotai"
import { FontAwesomeIcon as FAI } from "@fortawesome/react-fontawesome"
import { IconProp } from "@fortawesome/fontawesome-svg-core"

// modules
import { uploaderAtom } from "../../atoms/uploaderAtom"
import { fsPathAtom } from "../../atoms/fsPathAtom"
import { collectionAtom } from "../../atoms/fsPathAtom"


const DndUpload = ({showSelf, setShowSelf}: {showSelf: boolean, setShowSelf: Function}) => {

  const fsPath = useAtomValue(fsPathAtom)
  const collection = useAtomValue(collectionAtom)
  const setUploaderAtom = useSetAtom(uploaderAtom)


  return (
    <div className={clsx("absolute w-full h-full bg-shading center-div z-40", !showSelf && "!hidden", collection != 'DRIVE' && "!hidden")}
    onDrop={ e => { 
      e.preventDefault()
      if (e.dataTransfer.files.length != 0) {
        setUploaderAtom(e.dataTransfer.files)
      }
      setShowSelf(false) // close dragAndDrop after drop
    }}>


      <div className="w-[94%] h-[94%] border-[4px] border-dashed rounded-2xl center-div flex-col">
        <FAI icon={"fa-solid fa-cloud-arrow-up" as IconProp} className="aspect-square h-[160px] mb-2"/>
        <div className="font-main_bold text-4xl">Upload files</div>
        <div className="font-main_regular_italic text-3xl opacity-50 break-words">Into 'drive:/{fsPath.join('/')}'</div>
      </div>


    </div>
  )
}



export { DndUpload }