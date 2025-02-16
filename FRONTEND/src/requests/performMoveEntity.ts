
import axios, { AxiosRequestConfig } from "axios"




const performMoveEntity = async (fsPath: string[], entityName: string, newParent: string) => {

  const reqBody = {
    target: 'drive:/' + [...fsPath, entityName].join('/'),
    newParent: newParent
  }

  const reqConfig: AxiosRequestConfig = {
    baseURL: window.API_URL,
    withCredentials: true
  }

  const res = await axios.post("/fs-service/move-entity", reqBody, reqConfig)
  return res.data
}



export { performMoveEntity }