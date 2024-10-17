
import axios, { AxiosRequestConfig } from "axios"

// modules
import { FsEntity } from "../models/FsEntity"



const fetchShared = async (): Promise<FsEntity[]> => {

  const reqConfig: AxiosRequestConfig = {
    baseURL: window.API_URL,
    withCredentials: true
  }

  const res = await axios.get<FsEntity[]>("/share-service/get-all-shared-entities", reqConfig)
  return res.data
}



export { fetchShared }