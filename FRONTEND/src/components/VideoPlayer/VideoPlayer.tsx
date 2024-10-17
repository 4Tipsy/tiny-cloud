
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




const VideoPlayer = ({entityEid}: {entityEid: string}) => {

  const videoSrcUrl = window.API_URL + "/download-service/download-by-eid?target=" + entityEid
  


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


  const [_videoResolution, _setVideoResolution] = useState<[number, number]>([0, 0])
  const [_, setLocation] = useLocation()




  
  useEffect(() => {

    const _esc = (e: KeyboardEvent) => {
      if (e.key == "Escape") setLocation('/', {replace: true})
    }

    window.addEventListener('keydown', _esc)
    return () => window.removeEventListener('keydown', _esc)
  }, [])




  const alertSharedLink = () => alert(`${window.SHARE_BASE_URL}/${user.data!!.name}/${entity.data?.sharedLink}`)


  return (
    <div className="absolute w-full h-full bg-shading center-div flex-col  z-40"
    onClick={_ => setLocation("/", {replace: true})}>



      {entity.isLoading &&
      <FAI icon={"fa-solid fa-spinner" as IconProp} spin/>}


      { entity.isError &&
        <div onClick={e => e.stopPropagation()}>
          <div className="text-3xl font-main_semiBold">Video player error</div>
          <div className="text-2xl text-status-err">Error: <span className="text-ntw">{entity.error.response.data.errorType}</span></div>
          <div className="text-2xl text-status-err">Details: <span className="text-ntw">{entity.error.response.data.errorDetail}</span></div>
        </div>
      }


      { (entity.isSuccess && (entity.data?.mimeType?.split('/')[0] != 'video')) &&
        <div onClick={e => e.stopPropagation()}>
          <div className="text-3xl font-main_semiBold">Video player error</div>
          <div className="text-2xl text-status-err">Error: <span className="text-ntw">Target is not video</span></div>
          {
            entity.data.baseType=='Directory' ? <div className="text-2xl text-status-err">Details: <span className="text-ntw">{'You trying to play a <Directory>'}</span></div>
                                              : <div className="text-2xl text-status-err">Details: <span className="text-ntw">File's ('{entity.data.name}') mime_type is '{entity.data.mimeType}' (not video as you see)</span></div>
          }
        </div>
      }


      { (entity.isSuccess && (entity.data?.mimeType?.split('/')[0] == 'video')) &&
      <>
        <video controls className="max-w-[80%] max-h-[80%]" onClick={e => e.stopPropagation()}
        onCanPlay={e => _setVideoResolution([e.currentTarget.clientWidth, e.currentTarget.clientHeight])}>
          <source src={videoSrcUrl} />
        </video>

        <div className="text-2xl flex flex-col items-center  mt-2 max-w-full break-words" onClick={e => e.stopPropagation()}>
            <div className="entity-name font-main_semiBold max-w-full">{entity.data.name}</div>
            <div className="entity-info text-main-3">
              {entity.data.mimeType} | size: { prettifySize(entity.data.size) } | {_videoResolution[0]}x{_videoResolution[1]} px | {entity.data.isShared ? <span className="text-highlight cursor-pointer hover:underline" onClick={alertSharedLink}>[shared_link]</span> : 'not_shared'}
            </div>
          </div>
      </>
      }


    </div>
  )
}




export { VideoPlayer }