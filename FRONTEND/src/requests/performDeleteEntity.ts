
import axios, { AxiosRequestConfig } from "axios"




const performDeleteEntity = async (fsPath: string[], entityName: string) => {

  const reqBody = {
    target: 'drive:/' + [...fsPath, entityName].join('/')
  }

  const reqConfig: AxiosRequestConfig = {
    baseURL: window.API_URL,
    withCredentials: true
  }

  const res = await axios.post("/fs-service/delete-entity", reqBody, reqConfig)
  return res.data
}



export { performDeleteEntity }