
import { useLocation } from "wouter"
import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { FontAwesomeIcon as FAI } from "@fortawesome/react-fontawesome"
import { IconProp } from "@fortawesome/fontawesome-svg-core"

import axios from "axios"
import Scrollbars from "react-custom-scrollbars-2"

// modules
import { fetchSingleEntity as _fetchSingleEntity } from "../../requests/fetchSingleEntity"
import { fetchUser } from "../../requests/fetchUser"
import { FsEntity } from "../../models/FsEntity"
import { User } from "../../models/User"
import { prettifySize } from "../../util/prettifySize"




const RTextViewer = ({entityEid}: {entityEid: string}) => {

  const rawTextSrcUrl = window.API_URL + "/download-service/download-by-eid?target=" + entityEid
  


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


  const [location, setLocation] = useLocation()



  // text viewing
  const [txtContent, setTxtContent] = useState("loading...")
  useEffect(() => {

    // eid of Directory always ends with 'D'. As it wouldn't be previewed anyway, lets spare server and won't download it (cuz downloading dirs is fucking expensive!)
    if (entityEid.endsWith('D')) {return}
    
    axios.get(rawTextSrcUrl, {withCredentials: true})
    .then(res => {
      setTxtContent(res.data)
    })
    .catch(exc => {
      console.error(exc)
    })
  }, [location])




  const alertSharedLink = () => alert(`${window.SHARE_BASE_URL}/${user.data!!.name}/${entity.data?.sharedLink}`)


  return (
    <div className="absolute w-full h-full bg-shading center-div flex-col  z-40"
    onClick={_ => setLocation("/", {replace: true})}>




      {entity.isLoading &&
      <FAI icon={"fa-solid fa-spinner" as IconProp} spin/>}


      { entity.isError &&
        <div onClick={e => e.stopPropagation()}>
          <div className="text-3xl font-main_semiBold">Text viewer error</div>
          <div className="text-2xl text-status-err">Error: <span className="text-ntw">{entity.error.response.data.errorType}</span></div>
          <div className="text-2xl text-status-err">Details: <span className="text-ntw">{entity.error.response.data.errorDetail}</span></div>
        </div>
      }

      { (entity.isSuccess && entity.data.baseType=='Directory') &&
        <div onClick={e => e.stopPropagation()}>
          <div className="text-3xl font-main_semiBold">You serious...?<br/>Directory? As text?</div>
        </div>
      }

      { (entity.isSuccess && entity.data.baseType=='File') &&
        <>
          <div className="h-[80%] aspect-square max-w-[80%] bg-ntw text-[#000] p-[1%]"
          onClick={e => e.stopPropagation()}>
            <Scrollbars autoHide={false}>
              <div className="whitespace-pre-line p-[2%]">
                {txtContent}
              </div>
            </Scrollbars>
          </div>


          <div className="text-2xl flex flex-col items-center  mt-2 max-w-full break-words" onClick={e => e.stopPropagation()}>
            <div className="entity-name font-main_semiBold max-w-full">{entity.data.name}</div>
            <div className="entity-info text-main-3">
              {entity.data.mimeType} (as raw_text) | size: { prettifySize(entity.data.size) } | {entity.data.isShared ? <span className="text-highlight cursor-pointer hover:underline" onClick={alertSharedLink}>[shared_link]</span> : 'not_shared'}
            </div>
          </div>
        </>
      }



    </div>
  )
}






export { RTextViewer }