/*
* ANY RERENDER OF THIS COMPONENT, TRIGGERS FILE UPLOADING AGAIN
* MOVING TO ANOTHER DIR, TRIGGERS UPLOADING TO THIS DIR AS WELL (partly solved)
* I HAVE NO IDEA HOW TO FIX IT RN...
*/



import { useAtom, useAtomValue } from "jotai"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState, useEffect } from "react"
import { FontAwesomeIcon as FAI } from "@fortawesome/react-fontawesome"
import { Scrollbars } from "react-custom-scrollbars-2"
import { IconProp } from "@fortawesome/fontawesome-svg-core"

import axios, { AxiosRequestConfig } from "axios"

// components
import { uploaderAtom } from "../../atoms/uploaderAtom"
import { fsPathAtom } from "../../atoms/fsPathAtom"
import { collectionAtom } from "../../atoms/fsPathAtom"
import { prettifySize } from "../../util/prettifySize"





const UploadingFrame = () => {

  const [uploaderCtx, setUploaderCtx] = useAtom(uploaderAtom)
  const fsPath = useAtomValue(fsPathAtom)
  const collection = useAtomValue(collectionAtom)
  const queryClient = useQueryClient()


  if (uploaderCtx == null) { return }
  if (collection !== "DRIVE") { setUploaderCtx(null); return }
  return (
    <div className="absolute bottom-0 right-[4%] text-xl bg-shading rounded-t-lg  flex flex-col z-[41]  h-[40vh] desktop:w-[30vw] tablet:w-[50vw]">

      <div className="w-full text-center  py-2">
        <span className="cursor-pointer hover:underline"
        onClick={_ => setUploaderCtx(null)}
        >[close_and_?cancel_upload]</span>
      </div>


      <div className="w-full flex-grow">
        <Scrollbars renderThumbVertical={_ => <div className="bg-main-3 rounded-full"/>}>
          <div className="flex flex-col gap-4 px-4 pb-4">
            {Array.from(uploaderCtx).map(f => <UploadingFile file={f} key={f.name+f.size+f.type}/>)}
          </div>
        </Scrollbars>
      </div>
    </div>
  )









  function UploadingFile({file}: {file: File}) {
    console.log(['uploadingFile', file.name]);
    

    const [uploadPercentage, setUploadPercentage] = useState(0)
    const uploadMutation = useMutation({
      mutationKey: ['uploadingFile', file.name],
      mutationFn: _uploadFile,
      retry: false,
    
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ["contents"]})
      },

      onError: e => console.log(e)
      
    })


    useEffect(() => {
      uploadMutation.mutateAsync()

    }, [])



    return (
      <div className="flex items-center gap-2 p-2 w-full relative">
        <div className="text-highlight">
          {
            uploadMutation.isPending
            ? `${uploadPercentage}%`

            : uploadMutation.isSuccess
            ? <span>100%</span>

            : uploadMutation.isError
            ? <span className="cursor-pointer hover:underline"
            //@ts-ignore
            onClick={_ => alert(`Error: ${uploadMutation.error?.errorType}\nDetails: ${uploadMutation.error?.errorDetail}`)}
            >[Err]</span>

            : '0%'
          }
        </div>
        <FAI icon={"fa-solid fa-cloud-arrow-up" as IconProp} className=""/>
        <div className="text-ellipsis overflow-hidden flex-grow text-nowrap">{file.name}</div>
        <div className="text-nowrap">{prettifySize(file.size)}</div>

        <div className="absolute h-full left-0 rounded z-[-1]" style={{width: `${uploadPercentage}%`, backgroundImage: "url('/abstract.gif')"}}/>
      </div>
    )





    async function _uploadFile() {

      const reqConfig: AxiosRequestConfig = {
        baseURL: window.API_URL,
        withCredentials: true,
        onUploadProgress: (e) => {
          setUploadPercentage( Math.round((100 * e.loaded) / file.size) )
        }
      }
    
      const _reqBody = {
        where: 'drive:/' + [...fsPath].join('/'),
        name: file.name
      }

      const formData = new FormData()
      formData.append("Request", JSON.stringify(_reqBody))
      formData.append("File", file)

      return await axios.post("/fs-service/upload-file", formData, reqConfig)
    }
  }



}








export { UploadingFrame }