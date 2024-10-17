
import axios, { AxiosRequestConfig } from "axios"

// modules
import { FsEntity } from "../models/FsEntity"



const fetchDirContents = async (where: string): Promise<FsEntity[]> => {

  const reqConfig: AxiosRequestConfig = {
    baseURL: window.API_URL,
    withCredentials: true
  }

  const reqBody = {
    where: where
  }

  const res = await axios.post<FsEntity[]>("/fs-service/get-dir-contents", reqBody, reqConfig)
  return res.data
}



export { fetchDirContents }