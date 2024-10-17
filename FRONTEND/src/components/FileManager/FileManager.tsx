
import clsx from "clsx"
import { useEffect, useRef } from "react"
import { useLocation } from "wouter"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { FontAwesomeIcon as FAI } from "@fortawesome/react-fontawesome"
import { AxiosError } from "axios"
import { Scrollbars } from "react-custom-scrollbars-2"
import { IconProp } from "@fortawesome/fontawesome-svg-core"

// modules
import { fetchDirContents as _fetchDirContents} from "../../requests/fetchDirContents"
import { fetchShared as _fetchShared } from "../../requests/fetchShared"
import { performCreateNewDir as _performCreateNewDir } from "../../requests/performCreateNewDir"
import { FsEntity } from "../../models/FsEntity"
import { BaseErrorRes } from "../../models/BaseErrorRes"
import { fsViewMode } from "../../atoms/fsViewModeAtom"
import { collectionAtom, fsPathAtom } from "../../atoms/fsPathAtom"
import { uploaderAtom } from "../../atoms/uploaderAtom"

import { FsEntity_card } from "./FsEntity_card"
import { FsEntity_inTable } from "./FsEntity_inTable"
import { sortContents } from "./sortContents"






const FileManager = () => {

  const [viewMode, setViewMode] = useAtom(fsViewMode)
  const collection = useAtomValue(collectionAtom)
  const [fsPath, setFsPath] = useAtom(fsPathAtom)

  const [location, _] = useLocation()
  const queryClient = useQueryClient()
  const newDirBtnRef = useRef<HTMLDivElement>(null)

  const uploadFileRef = useRef<HTMLInputElement>(null)
  const setUploaderCtx = useSetAtom(uploaderAtom)
  

  const contents = useQuery<FsEntity[], BaseErrorRes>({
    queryKey: ['contents', collection, '/'+fsPath.join('/')],
    queryFn: fetchContents,  
    refetchOnWindowFocus: false,
    retry: false,
  })



  // hotkeys
  useEffect(() => {

    const _backspace = (e: KeyboardEvent) => {
      if (location != '/') { return }
      if (e.key == "Backspace") {
        e.preventDefault()
        
        if (fsPath.length != 0) {
          setFsPath( fsPath.slice(0, -1) )
        }
      }
    }


    const _shift = (e: KeyboardEvent) => {
      if (location != '/') { return }
      if (e.key == "Shift") {
        e.preventDefault()
        if (viewMode=='CARDS') { setViewMode('TABLE') }
        if (viewMode=='TABLE') { setViewMode('CARDS') }
      }
    }


    const _ctrls = (e: KeyboardEvent) => {
      if (location != '/') { return }
      if (e.key == "Delete") {
        e.preventDefault()
        queryClient.invalidateQueries({queryKey: ['contents']})
        queryClient.invalidateQueries({queryKey: ['user']})
      }

      if (e.ctrlKey && (e.key.toLowerCase() == 'm')) {
        e.preventDefault()
        newDirBtnRef.current?.click()
      }
    }


    window.addEventListener('keydown', _backspace)
    window.addEventListener('keydown', _shift)
    window.addEventListener('keydown', _ctrls)
    return () => {
      window.removeEventListener('keydown', _backspace)
      window.removeEventListener('keydown', _shift)
      window.removeEventListener('keydown', _ctrls)
    }
  }, [viewMode, location, fsPath])


  useEffect(() => {
    queryClient.invalidateQueries({queryKey: ['user']}) // to refetch used space if needed
  }, [fsPath])





  return (
    <div className="file-manager bg-main-1 flex-grow flex flex-col  p-[2%]">




      <div className="file-manager__options flex mobile:flex-col">

        <div className="text-3xl mt-[1px] overflow-hidden break-words  flex-grow">
          <span className="text-highlight cursor-pointer hover:underline" onClick={_ => setFsPath([])}>{`${collection}: `}</span>
          <span>
            {/* construct PATH */}
            { collection == "DRIVE"
            ? <>{fsPath.map( (p, idx) => <span key={p}>/<span className="cursor-pointer hover:underline" onClick={_ => { setFsPath(fsPath.slice(0, idx+1)) } }>{p}</span></span> )}/</>
            : ''
            }
            
          </span>
        </div>



        <div className="btns flex items-start gap-5  mobile:justify-between mobile:mt-4">

          <div className="view-mode-btns flex bg-main-2 border-[2px] border-main-3 rounded-lg">
            <div className={clsx("aspect-square h-[46px] center-div text-main-3 cursor-pointer hover:text-ntw",
            viewMode=='CARDS' && "!text-ntw")}
            onClick={_ => setViewMode('CARDS')}>
              <FAI className="aspect-square !h-[56%]" icon={"fa-table-cells-large fa-solid" as IconProp}/>
            </div>

            <div className="w-[2px] h-[32px] bg-main-3 self-center"/>

            <div className={clsx("aspect-square h-[46px] center-div text-main-3 cursor-pointer hover:text-ntw",
            viewMode=='TABLE' && "!text-ntw")}
            onClick={_ => setViewMode('TABLE')}>
              <FAI className="aspect-square !h-[56%]" icon={"fa-list fa-solid" as IconProp}/>
            </div>
          </div>


          <div className="flex flex-col desktop:flex-row gap-4">
            <div className="new-folder-btn h-[50px] aspect-[11/3] bg-main-2 border-main-3 border-[2px] rounded-lg center-div  text-2xl cursor-pointer hover:underline"
            ref={newDirBtnRef}
            onClick={_ => createNewDir()}>
              Create dir
            </div>

            <div className="new-folder-btn h-[50px] aspect-[11/3] bg-highlight border-main-3 border-[2px] rounded-lg center-div  text-2xl cursor-pointer hover:underline" onClick={_ => uploadFileRef.current?.click()}>
              Upload file
              <input type="file" multiple className="hidden" ref={uploadFileRef}
              onChange={e => {
                const fileList = e.currentTarget.files
                if (fileList) {
                  e.currentTarget.files = null
                  setUploaderCtx(fileList)
                }
              }}/>
            </div>
          </div>
          

          

        </div>

      </div>




      
      <div className="file-manager__additional-info text-lg font-main_semiBold text-main-3  pb-4">
        { (collection==='SHARED' && viewMode==='CARDS') &&
        <>Info: to check paths of shared entities, turn <span className="text-highlight">table</span> view mode</>
        }
        { (collection==='TRASH') &&
        <>Info: <span className="text-status-err opacity-60">not implemented yet</span></>
        }
      </div>




      <div className="file-manager__contents overflow-y-auto  flex-grow  mt-1">
        <Scrollbars renderThumbVertical={_ => <div className="bg-main-3 rounded-full"/>}>

          <div className="files grid  gap-6 pr-5  h-[1px]
          grid-cols-10 tablet:grid-cols-5 mobile:grid-cols-3">

            {
              contents.isSuccess && <RenderedContent/>
            }

          </div>


        </Scrollbars>
      </div>




    </div>
  )







  function RenderedContent() {

    const REFRESH_FS = () => {
      queryClient.invalidateQueries({queryKey: ['contents']})
      queryClient.invalidateQueries({queryKey: ['user']})
    }

    // filters/sort
    let _contents = sortContents( contents.data!! )


    if (viewMode === 'CARDS') {
      return (
        _contents.map(e => <FsEntity_card key={e.eid} entity={e} REFRESH_FS={REFRESH_FS}/>)
      )
    }
    if (viewMode === 'TABLE') {
      return (
        _contents.map(e => <FsEntity_inTable key={e.eid} entity={e} REFRESH_FS={REFRESH_FS}/>)
      )
    }
  }




  async function fetchContents(): Promise<FsEntity[]> {

    if (collection === 'DRIVE') {
      let where = 'drive:'
      fsPath.forEach( part => where += `/${part}`)
      if (where === 'drive:') {where += '/'}
      return await _fetchDirContents(where)
    }

    if (collection === 'SHARED') {
      return await _fetchShared()
    }

    else throw Error()
  }




  function createNewDir() {

    const newDirName = prompt("Enter new dir name")
    if (!newDirName) return

    _performCreateNewDir(fsPath, newDirName)
    .then(_ => queryClient.invalidateQueries({queryKey: ['contents']}) )
    .catch(_e => {
      const e: AxiosError = _e
  
  
      if (e.response) {
        //@ts-ignore      
        const s1 = `Error[${e.response.status}]: ${e.response.data.errorType}`
        //@ts-ignore    
        const s2 = `Details: ${e.response.data.errorDetail}`
  
        alert(s1 + '\n' + s2)
  
      } else {
        alert("Failed to send response")
  
      }
    })
  }



}










export { FileManager }