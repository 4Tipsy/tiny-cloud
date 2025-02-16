
import { useAtom, useAtomValue } from "jotai"
import { useLocation } from "wouter"
import { useQuery } from "@tanstack/react-query"

// modules
import { FsEntity } from "../../models/FsEntity"
import { User } from "../../models/User"
import { FsEntity_ico_ } from "./FsEntity_ico_"
import { prettifySize } from "../../util/prettifySize"
import { fsPathAtom, collectionAtom } from "../../atoms/fsPathAtom"
import React, { useState } from "react"

import { ContextMenu } from "./ContextMenu"

import { renameEntity, downloadEntity, shareEntity, unshareEntity, deleteEntity, moveEntity } from "./_someCommonFn"

import { fetchUser } from "../../requests/fetchUser"





const FsEntity_card = ({entity, REFRESH_FS}: {entity: FsEntity, REFRESH_FS: Function}) => {
  const _mimeType = entity.mimeType?.split('/')[0] || '_'


  const [fsPath, setFsPath] = useAtom(fsPathAtom)
  const collection = useAtomValue(collectionAtom)
  const [_, setLocation] = useLocation()


  const [contextMenuIsOpened, setContentMenuIsOpened] = useState(false)
  const [contextMenuCords, setContextMenuCords] = useState<[number, number]>([0, 0])



  const user = useQuery<User, any>({
    queryKey: ['user'],
    queryFn: fetchUser,
    refetchOnWindowFocus: false,
    retry: false,
  })



  const handleClick = () => {
    if (entity.baseType === 'Directory') {
      if (collection == 'DRIVE') setFsPath([...fsPath, entity.name]) // only in "drive:/..."
    }
    else if (_mimeType === "image") {
      setLocation(`/image/${entity.eid}`)
    }
    else if (_mimeType === "audio") {
      setLocation(`/audio/${entity.eid}`)
    }
    else if (_mimeType === "video") {
      setLocation(`/video/${entity.eid}`)
    }
    else if (_mimeType === "text") {
      setLocation(`/text/${entity.eid}`)
    }
    else {
      alert(`Can't auto handle mime_type ("${entity.mimeType}")`)
    }
  }



  let contextMenuOptions = [
    //{"label": "Open", "handler": handleClick},
    //{"label": "Open", "handler": <open_as_raw_text>},
    {"label": "Rename", "handler": () => renameEntity(fsPath, entity.name, REFRESH_FS) },
    {"label": "Download", "handler": () => downloadEntity(fsPath, entity.name) },
    (entity.isShared) 
      ? {"label": "Unshare", "handler": () => unshareEntity(fsPath, entity.name, REFRESH_FS)}
      : {"label": "Share", "handler": () => shareEntity(fsPath, entity.name, user.data!!.name, REFRESH_FS)},
    {"label": "Move", "handler": () => moveEntity(fsPath, entity.name, REFRESH_FS)},
    {"label": "Delete", "handler": () => deleteEntity(fsPath, entity.name, REFRESH_FS) },
  ]
  if (entity.baseType == 'File') {
    const _fn = () => setLocation(`/raw-text/${entity.eid}`)
    contextMenuOptions.unshift( {"label": "Raw text", "handler": _fn} )
  }
  if (entity.baseType == 'File' || collection == 'DRIVE') {
    contextMenuOptions.unshift( {"label": "Open", "handler": handleClick} )
  }


  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!e.ctrlKey) {
      e.stopPropagation()
      e.preventDefault()
      setContextMenuCords([e.pageX, e.pageY])
      setContentMenuIsOpened(true)
    }
  }



  return (
    <div
      onContextMenu={e => {handleContextMenu(e)} }
      data-eid={entity.eid}
      className="aspect-[2/3] flex flex-col items-center text-base  w-full h-full  hover:bg-[rgba(0,0,0,0.3)] rounded-xl cursor-pointer"
      onClick={_ => handleClick()}
    >

      <div className="aspect-square w-[90%] h-[60%] center-div">
        <FsEntity_ico_ className="w-[80%] !h-[80%] object-cover" e={entity} />
      </div>


      <div className="text-ellipsis text-nowrap overflow-hidden max-w-full">{entity.name}</div>


      <div className="opacity-40">{entity.size ? prettifySize(entity.size) : '<Dir>'}</div>

      { entity.isShared &&
      <div className="text-highlight hover:underline"
      onClick={e => {e.stopPropagation(); alert(`${window.SHARE_BASE_URL}/${user.data!!.name}/${entity.sharedLink}`) }}
      >[share_link]</div>
      }



      <ContextMenu cords={contextMenuCords} isOpened={contextMenuIsOpened} setIsOpened={setContentMenuIsOpened} menuOptions={contextMenuOptions} />
    </div>
  )
}




export { FsEntity_card }