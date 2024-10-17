
import clsx from "clsx"
import { useLocation } from "wouter"
import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { FontAwesomeIcon as FAI } from "@fortawesome/react-fontawesome"
import { IconProp } from "@fortawesome/fontawesome-svg-core"

// modules
import { fetchSingleEntity as _fetchSingleEntity } from "../../requests/fetchSingleEntity"
import { fetchUser } from "../../requests/fetchUser"
import { FsEntity } from "../../models/FsEntity"
import { User } from "../../models/User"
import { prettifySize } from "../../util/prettifySize"




const ImageViewer = ({entityEid}: {entityEid: string}) => {

  const imgSrcUrl = window.API_URL + "/download-service/download-by-eid?target=" + entityEid


  const entity = useQuery<FsEntity, any>({
    queryKey: ['viewingSingleFile', entityEid],
    queryFn: () => _fetchSingleEntity(entityEid),
    refetchOnWindowFocus: false,
    retry: false,
  })
  const user = useQuery<User, any>({
    queryKey: ['user'],
    queryFn: fetchUser,
    refetchOnWindowFocus: false,
    retry: false,
  })
  

  const [_imgResolution, _setImageResolution ] = useState<[number, number]>([0, 0])
  const [_, setLocation] = useLocation()


  // zoom
  const [showZoom, setShowZoom] = useState(false)
  const [cursorCords, setCursorCords] = useState<[number, number]>([-1000, -1000])
  const [zoomOnImgCords, setZoomOnImgCords] = useState<[number, number]>([0, 0])
  const [imgRenderedSize, setImgRenderedSize] = useState<[number, number]>([0, 0])




  useEffect(() => {

    const _esc = (e: KeyboardEvent) => {
      if (e.key == "Escape") setLocation('/', {replace: true})
    }
    window.addEventListener('keydown', _esc)
    return () => window.removeEventListener('keydown', _esc)
  }, [])





  const alertSharedLink = () => alert(`${window.SHARE_BASE_URL}/${user.data!!.name}/${entity.data?.sharedLink}`)


  return (
    <div className="bg-shading center-div flex-col absolute w-full h-full  z-40"
    onClick={_ => setLocation('/', {replace: true})}>



        

        {entity.isLoading &&
        <FAI icon={"fa-solid fa-spinner" as IconProp} spin/>}


        {entity.isError &&
        <div onClick={e => e.stopPropagation()}>
          <div className="text-3xl font-main_semiBold">Image viewer error</div>
          <div className="text-2xl text-status-err">Error: <span className="text-ntw">{entity.error.response.data.errorType}</span></div>
          <div className="text-2xl text-status-err">Details: <span className="text-ntw">{entity.error.response.data.errorDetail}</span></div>
        </div>
        }


        {(entity.isSuccess && (entity.data.mimeType?.split('/')[0] != 'image')) &&
          <div onClick={e => e.stopPropagation()}>
            <div className="text-3xl font-main_semiBold">Image viewer error</div>
            <div className="text-2xl text-status-err">Error: <span className="text-ntw">Target is not image</span></div>
            {
              entity.data.baseType=='Directory' ? <div className="text-2xl text-status-err">Details: <span className="text-ntw">{'You trying to preview a <Directory>'}</span></div>
                                                : <div className="text-2xl text-status-err">Details: <span className="text-ntw">File's ('{entity.data.name}') mime_type is '{entity.data.mimeType}' (not image as you see)</span></div>
            }
          </div>
        }



        {(entity.isSuccess && (entity.data.mimeType?.split('/')[0] == 'image')) &&
        <>

          <img
          onClick={e => e.stopPropagation()}
          className="max-w-[80%] max-h-[80%] object-contain"
          src={imgSrcUrl}
          alt={entity.data.name}
          onLoad={e => _setImageResolution([e.currentTarget.clientWidth, e.currentTarget.clientHeight])}

          onMouseEnter={ e => {
            setShowZoom(true)
            const {width, height} = e.currentTarget.getBoundingClientRect()
            setImgRenderedSize([width, height])            
          }}
          onMouseMove={ e => {
            const {top, left} = e.currentTarget.getBoundingClientRect()
            const x = e.pageX - left - window.pageXOffset
            const y = e.pageY - top - window.pageYOffset
            setZoomOnImgCords([x, y])
        
            setCursorCords([e.pageX, e.pageY])
          }}
          onMouseLeave={ () => setShowZoom(false) }
          />


          <div className="text-2xl flex flex-col items-center  mt-2 max-w-full break-words" onClick={e => e.stopPropagation()}>
            <div className="entity-name font-main_semiBold max-w-full">{entity.data.name}</div>
            <div className="entity-info text-main-3">
              {entity.data.mimeType} | size: { prettifySize(entity.data.size) } | {_imgResolution[0]}x{_imgResolution[1]} px | {entity.data.isShared ? <span className="text-highlight cursor-pointer hover:underline" onClick={alertSharedLink}>[shared_link]</span> : 'not_shared'}
            </div>
          </div>
        
        </>}
        



      




      <Zoom/>
    </div>
  )






  function Zoom() {

    const zoomLevel = 3
    const zoomCssSize = "min(30vw,400px)"

    return (
      <div className={clsx("zoom absolute pointer-events-none bg-no-repeat border-hlc border-2 aspect-square rounded-sm",
        !showZoom && "!hidden")}
  
        style={{
          height: zoomCssSize,
  
          left: `calc(${cursorCords[0]}px - ${zoomCssSize}  / 2)`,
          top: `calc(${cursorCords[1]}px - ${zoomCssSize} / 2)`,
  
  
          backgroundPositionX: `calc(${-zoomOnImgCords[0] * zoomLevel}px + ${zoomCssSize} / 2)`,
          backgroundPositionY: `calc(${-zoomOnImgCords[1] * zoomLevel}px + ${zoomCssSize} / 2)`,
  
          backgroundImage: `url('${imgSrcUrl}')`,
          backgroundSize: `${imgRenderedSize[0] * zoomLevel}px ${imgRenderedSize[1] * zoomLevel}px`,
        }}
      />
    )
  }

}



export { ImageViewer }