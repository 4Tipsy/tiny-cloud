
import axios, { AxiosRequestConfig } from "axios"




const performShare = async (fsPath: string[], entityName: string) => {

  const reqBody = {
    target: 'drive:/' + [...fsPath, entityName].join('/'),
  }

  const reqConfig: AxiosRequestConfig = {
    baseURL: window.API_URL,
    withCredentials: true
  }

  const res = await axios.post("/share-service/make-shared", reqBody, reqConfig)
  return res.data
}



const performUnshare = async (fsPath: string[], entityName: string) => {

  const reqBody = {
    target: 'drive:/' + [...fsPath, entityName].join('/'),
  }

  const reqConfig: AxiosRequestConfig = {
    baseURL: window.API_URL,
    withCredentials: true
  }

  const res = await axios.post("/share-service/make-unshared", reqBody, reqConfig)
  return res.data
}





export { performShare, performUnshare }