
import clsx from "clsx"
import { FontAwesomeIcon as FAI } from "@fortawesome/react-fontawesome"

// modules
import { FsEntity } from "../../models/FsEntity"
import { IconProp } from "@fortawesome/fontawesome-svg-core"



const FsEntity_ico_ = ({e, className}: {e: FsEntity, className: string}) => {
  const _mimeType = e.mimeType?.split('/')[0] || '_'


  // if Directory
  if (e.baseType === 'Directory') {
    return ( <FAI className={className} icon={"fa-folder-closed fa-solid" as IconProp}/> )


  // if File
  } else {
    return (


      _mimeType==="image"
      ? <img className={className} alt='err' src={window.API_URL + '/download-service/download-by-eid?target=' + e.eid} />



      : _mimeType==="audio"
      ? <FAI className={className} icon={"fa-file-audio fa-solid" as IconProp}/>



      : _mimeType==="video"
      ? 
      <div className={clsx("relative", className)}>
        <img className="w-full h-full bg-cover center-div text-md" alt='no preview' src={window.API_URL + '/download-service/download-by-eid?target=' + e.eid} />
        <div className="absolute w-full h-full top-0 left-0 bg-[url('/video-frame.png')] bg-contain"/>
      </div>



      : extensions.code.some(i => e.name.endsWith(i))
      ? <FAI className={className} icon={"fa-file-code fa-solid" as IconProp}/>

      : extensions.arcs.some(i => e.name.endsWith(i))
      ? <FAI className={className} icon={"fa-file-zipper fa-solid" as IconProp}/>

      : extensions.wordFileFormat.some(i => e.name.endsWith(i))
      ? <FAI className={className} icon={"fa-file-word fa-solid" as IconProp}/>


      // any other file
      : <FAI className={className} icon={"fa-file fa-solid" as IconProp}/>


    )
  }
}







const extensions = {

  code: [
    // configs
    '.json', '.json5', '.toml', '.yaml', '.yml', '.xml', '.conf', '.ini', '.cfg', '.info',
    // program langs
    '.js', '.jsx', '.jsm', '.ts', '.tsx', '.py', '.rs', '.kt', '.scala', '.java', '.go', '.sh', '.bat',
  ],

  arcs: [
    '.zip', '.zipx', 'rar', '.7z', '.s7z',
    '.jar',
    '.tar', '.tar.gz', '.tgz', '.tar.bz2', '.tbz2', '.tar.xz', '.txz', '.tar.zst', '.tar.Z'
  ],

  wordFileFormat: [
    '.doc', 'docx', '.dot', '.dotx', '.docm', '.dotm'
  ]

}







export { FsEntity_ico_ }