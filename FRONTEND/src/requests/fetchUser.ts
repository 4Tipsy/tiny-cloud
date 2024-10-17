
import axios, { AxiosRequestConfig } from "axios"

// modules
import { User } from "../models/User"



const fetchUser = async (): Promise<User> => {

  const reqConfig: AxiosRequestConfig = {
    baseURL: window.API_URL,
    withCredentials: true
  }

  const res = await axios.get<User>("/user-service/get-current-user", reqConfig)
  return res.data
}







export { fetchUser }