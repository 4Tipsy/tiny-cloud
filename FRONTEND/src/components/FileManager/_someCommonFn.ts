
import { AxiosError } from "axios"
import { performRenameEntity } from "../../requests/performRenameEntity"
import { performDeleteEntity } from "../../requests/performDeleteEntity"
import { performShare, performUnshare } from "../../requests/performShareActions"




const renameEntity = (fsPath: string[], entityName: string, RELOADER: Function) => {

  const newName = prompt(`Enter new name for entity '${entityName}'`)
  if (!newName) return


  performRenameEntity(fsPath, entityName, newName)
  .then(_ => {
    RELOADER()
  })
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





const downloadEntity = (fsPath: string[], entityName: string) => {
  const downloadUrl = window.API_URL + "/download-service/download?target=" + "drive:/" + [...fsPath, entityName].join('/')
  window.open(downloadUrl, "_blank")
}



const shareEntity = (fsPath: string[], entityName: string, userName: string, RELOADER: Function) => {

  if (!confirm(`Share entity '${entityName}'?`)) return


  performShare(fsPath, entityName)
  .then(res => {
    RELOADER()
    alert(`Link: '${window.SHARE_BASE_URL}/${userName}/${res.sharedLink}'`)
  })
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



const unshareEntity = (fsPath: string[], entityName: string, RELOADER: Function) => {

  if (!confirm(`Delete entity '${entityName}'?`)) return


  performUnshare(fsPath, entityName)
  .then(_ => {
    RELOADER()
  })
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



const deleteEntity = (fsPath: string[], entityName: string, RELOADER: Function) => {

  if (!confirm(`Delete entity '${entityName}'?`)) return


  performDeleteEntity(fsPath, entityName)
  .then(_ => {
    RELOADER()
  })
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





export { renameEntity, downloadEntity, shareEntity, unshareEntity, deleteEntity }