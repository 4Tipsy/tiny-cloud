
import axios, { AxiosRequestConfig } from "axios"




const performRenameEntity = async (fsPath: string[], entityName: string, newName: string) => {

  const reqBody = {
    target: 'drive:/' + [...fsPath, entityName].join('/'),
    newName: newName
  }

  const reqConfig: AxiosRequestConfig = {
    baseURL: window.API_URL,
    withCredentials: true
  }

  const res = await axios.post("/fs-service/rename-entity", reqBody, reqConfig)
  return res.data
}



export { performRenameEntity }