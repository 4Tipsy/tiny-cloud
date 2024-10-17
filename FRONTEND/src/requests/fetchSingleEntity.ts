
import axios, { AxiosRequestConfig } from "axios"

// modules
import { FsEntity } from "../models/FsEntity"



const fetchSingleEntity = async (targetEid: string) => {

  const reqConfig: AxiosRequestConfig = {
    baseURL: window.API_URL,
    withCredentials: true
  }

  const reqBody = {
    targetEid: targetEid
  }

  const res = await axios.post<FsEntity>("/fs-service/get-entity-by-eid", reqBody, reqConfig)
  return res.data
}



export { fetchSingleEntity }