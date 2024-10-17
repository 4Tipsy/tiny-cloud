
import { useLocation } from "wouter"
import { useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { FontAwesomeIcon as FAI } from "@fortawesome/react-fontawesome"
import { IconProp } from "@fortawesome/fontawesome-svg-core"

// modules
import { fetchSingleEntity as _fetchSingleEntity } from "../../requests/fetchSingleEntity"
import { fetchUser } from "../../requests/fetchUser"
import { FsEntity } from "../../models/FsEntity"
import { User } from "../../models/User"
import { prettifySize } from "../../util/prettifySize"



const AudioPlayer = ({entityEid}: {entityEid: string}) => {

  const audioSrcUrl = window.API_URL + "/download-service/download-by-eid?target=" + entityEid


  


  const [_, setLocation] = useLocation()


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
    onClick={_ => setLocation('/', {replace: true})}>



      {entity.isLoading &&
      <FAI icon={"fa-solid fa-spinner" as IconProp} spin/>}


      { entity.isError &&
        <div onClick={e => e.stopPropagation()}>
          <div className="text-3xl font-main_semiBold">Audio player error</div>
          <div className="text-2xl text-status-err">Error: <span className="text-ntw">{entity.error.response.data.errorType}</span></div>
          <div className="text-2xl text-status-err">Details: <span className="text-ntw">{entity.error.response.data.errorDetail}</span></div>
        </div>
      }


      { (entity.isSuccess && (entity.data?.mimeType?.split('/')[0] != 'audio')) &&
        <div onClick={e => e.stopPropagation()}>
          <div className="text-3xl font-main_semiBold">Audio player error</div>
          <div className="text-2xl text-status-err">Error: <span className="text-ntw">Target is not audio</span></div>
          {
            entity.data.baseType=='Directory' ? <div className="text-2xl text-status-err">Details: <span className="text-ntw">{'You trying to preview a <Directory>'}</span></div>
                                              : <div className="text-2xl text-status-err">Details: <span className="text-ntw">File's ('{entity.data.name}') mime_type is '{entity.data.mimeType}' (not audio as you see)</span></div>
          }
        </div>
      }




      { entity.isSuccess && (entity.data?.mimeType?.split('/')[0] == 'audio') &&
        <>
          <div className="max-w-[70%] max-h-[70%] tablet:w-[40%] tablet:h-[40%] desktop:w-[40%] desktop:h-[40%] center-div flex-col"
          onClick={e => e.stopPropagation()}>
            <FAI className="aspect-square w-[50%] !h-[50%]" icon={"fa-file-audio fa-solid" as IconProp} />


            <div className="player bg-shading w-full desktop:w-[80%] p-4  flex flex-col items-center gap-2  mt-6"
            onClick={e => e.stopPropagation()}>

              <div className="text-2xl">{entity.data.name}</div>

              <audio controls className="w-full rounded-none">
                <source src={audioSrcUrl} type={entity.data.mimeType}/>
              </audio>

              <div className="text-2xl text-main-3">
                {entity.data.mimeType} | size: { prettifySize(entity.data.size) } | {entity.data.isShared ? <span className="text-highlight cursor-pointer hover:underline" onClick={alertSharedLink}>[shared_link]</span> : 'not_shared'}
              </div>

            </div>


          </div>
        </>
      }




    </div>
  )



}



export { AudioPlayer }