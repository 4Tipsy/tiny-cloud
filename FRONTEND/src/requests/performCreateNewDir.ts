
import axios, { AxiosRequestConfig } from "axios"




const performCreateNewDir = async (fsPath: string[], newDirName: string) => {

  const reqBody = {
    where: 'drive:/' + [...fsPath].join('/'),
    name: newDirName
  }

  const reqConfig: AxiosRequestConfig = {
    baseURL: window.API_URL,
    withCredentials: true
  }

  const res = await axios.post("/fs-service/create-new-dir", reqBody, reqConfig)
  return res.data
}



export { performCreateNewDir }